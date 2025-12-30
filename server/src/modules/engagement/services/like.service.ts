import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'

@Injectable()
export class LikeService {
	constructor(private readonly db: DatabaseService) {}

	async toggleLike(accountId: string, videoId: string) {
		const video = await this.db.video.findUnique({
			where: { id: videoId },
		})

		if (!video) {
			throw new NotFoundException('Video not found')
		}

		const existingLike = await this.db.like.findFirst({
			where: {
				accountId,
				videoId,
			},
		})

		if (existingLike) {
			await this.db.like.delete({
				where: { id: existingLike.id },
			})

			return {
				isLiked: false,
				message: 'Video unliked',
			}
		} else {
			await this.db.like.create({
				data: {
					accountId,
					videoId,
				},
			})

			return {
				isLiked: true,
				message: 'Video liked',
			}
		}
	}

	async getLikedVideos(accountId: string, page = 1, limit = 20) {
		const skip = (page - 1) * limit

		const [likes, total] = await Promise.all([
			this.db.like.findMany({
				where: { accountId },
				include: {
					video: {
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
					},
				},
				orderBy: { createdAt: 'desc' },
				skip,
				take: limit,
			}),
			this.db.like.count({ where: { accountId } }),
		])

		const videos = likes.map(like => like.video)

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

	async isLiked(accountId: string, videoId: string): Promise<boolean> {
		const like = await this.db.like.findFirst({
			where: {
				accountId,
				videoId,
			},
		})

		return !!like
	}

	async getLikeCount(videoId: string): Promise<number> {
		return this.db.like.count({
			where: { videoId },
		})
	}
}
