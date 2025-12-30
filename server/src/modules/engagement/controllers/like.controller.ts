import { Controller, Post, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@core/guards/auth.guard'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { LikeService } from '../services/like.service'

@Controller('likes')
@UseGuards(AuthGuard)
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	@Post('video/:videoId')
	async toggleLike(
		@CurrentAccount('accountId') accountId: string,
		@Param('videoId') videoId: string
	) {
		return this.likeService.toggleLike(accountId, videoId)
	}

	@Get('videos')
	async getLikedVideos(
		@CurrentAccount('accountId') accountId: string,
		@Query('page', new ParseIntPipe({ optional: true })) page = 1,
		@Query('limit', new ParseIntPipe({ optional: true })) limit = 20
	) {
		return this.likeService.getLikedVideos(accountId, page, limit)
	}

	@Get('video/:videoId/check')
	async checkLike(
		@CurrentAccount('accountId') accountId: string,
		@Param('videoId') videoId: string
	) {
		const isLiked = await this.likeService.isLiked(accountId, videoId)
		return { isLiked }
	}
}
