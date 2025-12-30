import {
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
} from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { UpdateChannelDto } from '../dto/channel.dto'

@Injectable()
export class ChannelService {
	constructor(private readonly db: DatabaseService) {}

	async findById(channelId: string) {
		const channel = await this.db.channel.findUnique({
			where: { id: channelId },
			include: {
				owner: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				_count: {
					select: {
						videos: { where: { isPublished: true } },
						followers: true,
					},
				},
			},
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		return channel
	}

	async findByHandle(handle: string) {
		const channel = await this.db.channel.findUnique({
			where: { handle },
			include: {
				owner: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				_count: {
					select: {
						videos: { where: { isPublished: true } },
						followers: true,
					},
				},
			},
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		return channel
	}

	async findByOwnerId(ownerId: string) {
		const channel = await this.db.channel.findUnique({
			where: { ownerId },
			include: {
				owner: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				_count: {
					select: {
						videos: { where: { isPublished: true } },
						followers: true,
					},
				},
			},
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		return channel
	}

	async updateChannel(ownerId: string, dto: UpdateChannelDto) {
		const channel = await this.db.channel.findUnique({
			where: { ownerId },
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		if (dto.handle && dto.handle !== channel.handle) {
			const existingChannel = await this.db.channel.findUnique({
				where: { handle: dto.handle },
			})

			if (existingChannel) {
				throw new ConflictException('Handle already taken')
			}
		}

		return this.db.channel.update({
			where: { id: channel.id },
			data: {
				handle: dto.handle,
				bio: dto.bio,
			},
			include: {
				owner: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				_count: {
					select: {
						videos: { where: { isPublished: true } },
						followers: true,
					},
				},
			},
		})
	}

	async subscribe(accountId: string, channelId: string) {
		const channel = await this.db.channel.findUnique({
			where: { id: channelId },
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		const account = await this.db.account.findUnique({
			where: { id: accountId },
			include: {
				subscriptions: {
					where: { id: channelId },
				},
			},
		})

		if (account?.subscriptions.length) {
			throw new BadRequestException('Already subscribed to this channel')
		}

		await this.db.account.update({
			where: { id: accountId },
			data: {
				subscriptions: {
					connect: { id: channelId },
				},
			},
		})

		return { message: 'Subscribed successfully' }
	}

	async unsubscribe(accountId: string, channelId: string) {
		const account = await this.db.account.findUnique({
			where: { id: accountId },
			include: {
				subscriptions: {
					where: { id: channelId },
				},
			},
		})

		if (!account?.subscriptions.length) {
			throw new BadRequestException('Not subscribed to this channel')
		}

		await this.db.account.update({
			where: { id: accountId },
			data: {
				subscriptions: {
					disconnect: { id: channelId },
				},
			},
		})

		return { message: 'Unsubscribed successfully' }
	}

	async getSubscriptions(accountId: string) {
		const account = await this.db.account.findUnique({
			where: { id: accountId },
			include: {
				subscriptions: {
					include: {
						owner: {
							select: {
								id: true,
								name: true,
							},
						},
						_count: {
							select: {
								videos: { where: { isPublished: true } },
								followers: true,
							},
						},
					},
				},
			},
		})

		return account?.subscriptions || []
	}

	async isSubscribed(accountId: string, channelId: string): Promise<boolean> {
		const account = await this.db.account.findUnique({
			where: { id: accountId },
			include: {
				subscriptions: {
					where: { id: channelId },
				},
			},
		})

		return !!account?.subscriptions.length
	}

	async getChannelVideos(channelId: string, page = 1, limit = 20) {
		const skip = (page - 1) * limit

		const [videos, total] = await Promise.all([
			this.db.video.findMany({
				where: {
					channelId,
					isPublished: true,
				},
				include: {
					channel: {
						include: {
							owner: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					_count: {
						select: {
							likes: true,
							comments: true,
						},
					},
				},
				orderBy: { createdAt: 'desc' },
				skip,
				take: limit,
			}),
			this.db.video.count({
				where: {
					channelId,
					isPublished: true,
				},
			}),
		])

		return {
			videos,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}
}
