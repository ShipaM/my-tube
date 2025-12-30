import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'

@Injectable()
export class ViewService {
	constructor(private readonly db: DatabaseService) {}

	async recordView(accountId: string, videoId: string) {
		await this.db.$transaction([
			this.db.view.create({
				data: {
					accountId,
					videoId,
				},
			}),
			this.db.video.update({
				where: { id: videoId },
				data: {
					views: { increment: 1 },
				},
			}),
		])

		return { message: 'View recorded' }
	}

	async getWatchHistory(accountId: string, page = 1, limit = 20) {
		const skip = (page - 1) * limit

		const [views, totalCount] = await Promise.all([
			this.db.view.findMany({
				where: { accountId },
				orderBy: { viewedAt: 'desc' },
				distinct: ['videoId'],
				skip,
				take: limit,
				select: {
					videoId: true,
					viewedAt: true,
					video: {
						select: {
							id: true,
							publicId: true,
							title: true,
							description: true,
							thumbnailPath: true,
							views: true,
							createdAt: true,
							channel: {
								select: {
									id: true,
									handle: true,
									avatarPath: true,
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
			}),
			this.db.view.groupBy({
				by: ['videoId'],
				where: { accountId },
				_count: true,
			}),
		])

		const videos = views.map(record => record.video)

		return {
			videos,
			pagination: {
				page,
				limit,
				total: totalCount.length,
				totalPages: Math.ceil(totalCount.length / limit),
			},
		}
	}

	async clearWatchHistory(accountId: string) {
		await this.db.view.deleteMany({
			where: { accountId },
		})

		return { message: 'Watch history cleared' }
	}

	async getViewCount(videoId: string): Promise<number> {
		const video = await this.db.video.findUnique({
			where: { id: videoId },
			select: { views: true },
		})

		return video?.views || 0
	}
}
