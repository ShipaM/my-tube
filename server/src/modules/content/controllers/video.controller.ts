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
import { OptionalAuthGuard } from '@core/guards/optional-auth.guard'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { VideoService } from '../services/video.service'
import { CreateVideoDto, UpdateVideoDto } from '../dto/video.dto'

@Controller('videos')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@Get()
	async getVideos(
		@Query('page', new ParseIntPipe({ optional: true })) page = 1,
		@Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
		@Query('search') search?: string,
		@Query('excludeIds') excludeIds?: string
	) {
		const excludeArray = excludeIds ? excludeIds.split(',') : undefined
		return this.videoService.getVideos(page, limit, search, excludeArray)
	}

	@Get(':publicId')
	@UseGuards(OptionalAuthGuard)
	async getVideo(
		@Param('publicId') publicId: string,
		@CurrentAccount('accountId') accountId?: string
	) {
		return this.videoService.findByPublicId(publicId, accountId)
	}

	@Post()
	@UseGuards(AuthGuard)
	async createVideo(@CurrentAccount('accountId') accountId: string, @Body() dto: CreateVideoDto) {
		return this.videoService.create(accountId, dto)
	}

	@Patch(':videoId')
	@UseGuards(AuthGuard)
	async updateVideo(
		@Param('videoId') videoId: string,
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: UpdateVideoDto
	) {
		return this.videoService.update(videoId, accountId, dto)
	}

	@Delete(':videoId')
	@UseGuards(AuthGuard)
	async deleteVideo(
		@Param('videoId') videoId: string,
		@CurrentAccount('accountId') accountId: string
	) {
		return this.videoService.delete(videoId, accountId)
	}

	@Get('me/videos')
	@UseGuards(AuthGuard)
	async getMyVideos(
		@CurrentAccount('accountId') accountId: string,
		@Query('page', new ParseIntPipe({ optional: true })) page = 1,
		@Query('limit', new ParseIntPipe({ optional: true })) limit = 20
	) {
		return this.videoService.getMyVideos(accountId, page, limit)
	}

	@Get('subscriptions/feed')
	@UseGuards(AuthGuard)
	async getSubscriptionVideos(
		@CurrentAccount('accountId') accountId: string,
		@Query('page', new ParseIntPipe({ optional: true })) page = 1,
		@Query('limit', new ParseIntPipe({ optional: true })) limit = 20
	) {
		return this.videoService.getSubscriptionVideos(accountId, page, limit)
	}

	@Post(':publicId/view')
	async incrementViews(@Param('publicId') publicId: string) {
		const video = await this.videoService.findByPublicId(publicId)
		await this.videoService.incrementViews(video.id)
		return { message: 'View recorded' }
	}
}
