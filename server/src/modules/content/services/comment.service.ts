import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto'

@Injectable()
export class CommentService {
	constructor(private readonly db: DatabaseService) {}

	async create(accountId: string, dto: CreateCommentDto) {
		const video = await this.db.video.findUnique({
			where: { id: dto.videoId },
		})

		if (!video) {
			throw new NotFoundException('Video not found')
		}

		const comment = await this.db.comment.create({
			data: {
				text: dto.text,
				authorId: accountId,
				videoId: dto.videoId,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						channel: {
							select: {
								handle: true,
								avatarPath: true,
							},
						},
					},
				},
			},
		})

		return comment
	}

	async getVideoComments(videoId: string, page = 1, limit = 20) {
		const skip = (page - 1) * limit

		const [comments, total] = await Promise.all([
			this.db.comment.findMany({
				where: { videoId },
				include: {
					author: {
						select: {
							id: true,
							name: true,
							channel: {
								select: {
									handle: true,
									avatarPath: true,
								},
							},
						},
					},
				},
				orderBy: { createdAt: 'desc' },
				skip,
				take: limit,
			}),
			this.db.comment.count({ where: { videoId } }),
		])

		return {
			comments,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}

	async update(commentId: string, accountId: string, dto: UpdateCommentDto) {
		const comment = await this.db.comment.findUnique({
			where: { id: commentId },
		})

		if (!comment) {
			throw new NotFoundException('Comment not found')
		}

		if (comment.authorId !== accountId) {
			throw new ForbiddenException('You do not have permission to edit this comment')
		}

		return this.db.comment.update({
			where: { id: commentId },
			data: { text: dto.text },
			include: {
				author: {
					select: {
						id: true,
						name: true,
						channel: {
							select: {
								handle: true,
								avatarPath: true,
							},
						},
					},
				},
			},
		})
	}

	async delete(commentId: string, accountId: string) {
		const comment = await this.db.comment.findUnique({
			where: { id: commentId },
			include: {
				video: {
					include: {
						channel: true,
					},
				},
			},
		})

		if (!comment) {
			throw new NotFoundException('Comment not found')
		}

		const isAuthor = comment.authorId === accountId
		const isVideoOwner = comment.video.channel.ownerId === accountId

		if (!isAuthor && !isVideoOwner) {
			throw new ForbiddenException('You do not have permission to delete this comment')
		}

		await this.db.comment.delete({
			where: { id: commentId },
		})

		return { message: 'Comment deleted successfully' }
	}
}
