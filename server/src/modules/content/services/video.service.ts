import {
	Injectable,
	NotFoundException,
	ForbiddenException,
	BadRequestException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DatabaseService } from '@core/database/database.service'
import { CreateVideoDto, UpdateVideoDto } from '../dto/video.dto'
import { generatePublicId } from '@common/helpers/id.helper'
import { StorageService } from '@modules/storage/services/storage.service'

@Injectable()
export class VideoService {
	private baseUrl: string

	constructor(
		private readonly db: DatabaseService,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService
	) {
		const port = this.configService.get('PORT') || 4200
		this.baseUrl = this.configService.get('APP_URL') || `http://localhost:${port}`
	}

	private getAvailableQualities(videoFileName: string): string[] {
		if (!videoFileName) return []

		const qualities = ['360p', '480p', '720p', '1080p', '2k', '4k']
		const availableQualities: string[] = []

		for (const quality of qualities) {
			const filePath = `content/videos/${quality}/${videoFileName}`
			if (this.storageService.fileExists(filePath)) {
				availableQualities.push(quality)
			}
		}

		return availableQualities
	}

	private transformVideoWithUrls(video: any) {
		return {
			...video,
			thumbnailUrl: video.thumbnailPath ? `${this.baseUrl}/${video.thumbnailPath}` : null,
			channel: video.channel ? {
				...video.channel,
				avatarUrl: video.channel.avatarPath ? `${this.baseUrl}/${video.channel.avatarPath}` : null,
				bannerUrl: video.channel.bannerPath ? `${this.baseUrl}/${video.channel.bannerPath}` : null,
			} : video.channel,
		}
	}

	async create(accountId: string, dto: CreateVideoDto) {
		const channel = await this.db.channel.findUnique({
			where: { ownerId: accountId },
		})

		if (!channel) {
			throw new BadRequestException('Channel not found. Please create a channel first.')
		}

		const video = await this.db.video.create({
			data: {
				publicId: generatePublicId(),
				title: dto.title,
				description: dto.description,
				isPublished: dto.isPublished,
				channelId: channel.id,
				thumbnailPath: '',
				videoFileName: '',
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
			},
		})

		return video
	}

	async findByPublicId(publicId: string, accountId?: string) {
		const video = await this.db.video.findUnique({
			where: { publicId },
			include: {
				channel: {
					include: {
						owner: {
							select: {
								id: true,
								name: true,
							},
						},
						_count: {
							select: {
								followers: true,
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
		})

		if (!video) {
			throw new NotFoundException('Video not found')
		}

		if (!video.isPublished) {
			if (!accountId || video.channel.ownerId !== accountId) {
				throw new ForbiddenException('You do not have access to this video')
			}
		}

		let isLiked = false
		if (accountId) {
			const like = await this.db.like.findFirst({
				where: {
					accountId,
					videoId: video.id,
				},
			})
			isLiked = !!like
		}

		return {
			...video,
			isLiked,
			likesCount: video._count.likes,
			commentsCount: video._count.comments,
			subscribersCount: video.channel._count.followers,
			availableQualities: this.getAvailableQualities(video.videoFileName),
		}
	}

	async findById(videoId: string) {
		const video = await this.db.video.findUnique({
			where: { id: videoId },
			include: {
				channel: true,
			},
		})

		if (!video) {
			throw new NotFoundException('Video not found')
		}

		return video
	}

	async update(videoId: string, accountId: string, dto: UpdateVideoDto) {
		const video = await this.findById(videoId)

		if (video.channel.ownerId !== accountId) {
			throw new ForbiddenException('You do not have permission to edit this video')
		}

		return this.db.video.update({
			where: { id: videoId },
			data: {
				title: dto.title,
				description: dto.description,
				isPublished: dto.isPublished,
				publishedAt: dto.isPublished && !video.isPublished ? new Date() : video.publishedAt,
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
			},
		})
	}

	async delete(videoId: string, accountId: string) {
		const video = await this.findById(videoId)

		if (video.channel.ownerId !== accountId) {
			throw new ForbiddenException('You do not have permission to delete this video')
		}

		await this.db.video.delete({
			where: { id: videoId },
		})

		return { message: 'Video deleted successfully' }
	}

	async getVideos(page = 1, limit = 20, search?: string, excludeIds?: string[]) {
		const skip = (page - 1) * limit

		const where: any = {
			isPublished: true,
		}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } },
			]
		}

		if (excludeIds && excludeIds.length > 0) {
			where.id = { notIn: excludeIds }
		}

		const [videos, total] = await Promise.all([
			this.db.video.findMany({
				where,
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
			this.db.video.count({ where }),
		])

		const videosWithQualities = videos.map(video => ({
			...video,
			availableQualities: this.getAvailableQualities(video.videoFileName),
		}))

		return {
			videos: videosWithQualities,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}

	async getSubscriptionVideos(accountId: string, page = 1, limit = 20) {
		const skip = (page - 1) * limit

		const account = await this.db.account.findUnique({
			where: { id: accountId },
			include: {
				subscriptions: {
					select: { id: true },
				},
			},
		})

		if (!account || !account.subscriptions.length) {
			return {
				videos: [],
				pagination: { page, limit, total: 0, totalPages: 0 },
			}
		}

		const channelIds = account.subscriptions.map(sub => sub.id)

		const [videos, total] = await Promise.all([
			this.db.video.findMany({
				where: {
					channelId: { in: channelIds },
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
				orderBy: { publishedAt: 'desc' },
				skip,
				take: limit,
			}),
			this.db.video.count({
				where: {
					channelId: { in: channelIds },
					isPublished: true,
				},
			}),
		])

		const videosWithQualities = videos.map(video => 
			this.transformVideoWithUrls({
				...video,
				availableQualities: this.getAvailableQualities(video.videoFileName),
			})
		)

		return {
			data: videosWithQualities,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}

	async getMyVideos(accountId: string, page = 1, limit = 20) {
		const skip = (page - 1) * limit

		const channel = await this.db.channel.findUnique({
			where: { ownerId: accountId },
		})

		if (!channel) {
			return {
				videos: [],
				pagination: { page, limit, total: 0, totalPages: 0 },
			}
		}

		const [videos, total] = await Promise.all([
			this.db.video.findMany({
				where: { channelId: channel.id },
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
				where: { channelId: channel.id },
			}),
		])

		const videosWithQualities = videos.map(video => 
			this.transformVideoWithUrls({
				...video,
				availableQualities: this.getAvailableQualities(video.videoFileName),
			})
		)

		return {
			data: videosWithQualities,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}

	async incrementViews(videoId: string) {
		await this.db.video.update({
			where: { id: videoId },
			data: {
				views: { increment: 1 },
			},
		})
	}

	async updateVideoFile(videoId: string, fileName: string, maxQuality: string) {
		return this.db.video.update({
			where: { id: videoId },
			data: {
				videoFileName: fileName,
				maxQuality,
			},
		})
	}

	async updateThumbnail(videoId: string, thumbnailPath: string) {
		return this.db.video.update({
			where: { id: videoId },
			data: { thumbnailPath },
		})
	}
}
