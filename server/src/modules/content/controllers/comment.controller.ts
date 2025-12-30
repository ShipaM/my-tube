import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	Query,
	UseGuards,
	ParseIntPipe,
} from '@nestjs/common'
import { AuthGuard } from '@core/guards/auth.guard'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { CommentService } from '../services/comment.service'
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto'

@Controller('comments')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Get('video/:videoId')
	async getVideoComments(
		@Param('videoId') videoId: string,
		@Query('page', new ParseIntPipe({ optional: true })) page = 1,
		@Query('limit', new ParseIntPipe({ optional: true })) limit = 20
	) {
		return this.commentService.getVideoComments(videoId, page, limit)
	}

	@Post()
	@UseGuards(AuthGuard)
	async createComment(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: CreateCommentDto
	) {
		return this.commentService.create(accountId, dto)
	}

	@Patch(':commentId')
	@UseGuards(AuthGuard)
	async updateComment(
		@Param('commentId') commentId: string,
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: UpdateCommentDto
	) {
		return this.commentService.update(commentId, accountId, dto)
	}

	@Delete(':commentId')
	@UseGuards(AuthGuard)
	async deleteComment(
		@Param('commentId') commentId: string,
		@CurrentAccount('accountId') accountId: string
	) {
		return this.commentService.delete(commentId, accountId)
	}
}
