import {
	Controller,
	Get,
	Patch,
	Post,
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
import { ChannelService } from '../services/channel.service'
import { UpdateChannelDto } from '../dto/channel.dto'

@Controller('channels')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Get(':handle')
	@UseGuards(OptionalAuthGuard)
	async getChannelByHandle(
		@Param('handle') handle: string,
		@CurrentAccount('accountId') accountId?: string
	) {
		const channel = await this.channelService.findByHandle(handle)

		let isSubscribed = false
		if (accountId) {
			isSubscribed = await this.channelService.isSubscribed(accountId, channel.id)
		}

		return {
			...channel,
			isSubscribed,
		}
	}

	@Get('me/channel')
	@UseGuards(AuthGuard)
	async getMyChannel(@CurrentAccount('accountId') accountId: string) {
		return this.channelService.findByOwnerId(accountId)
	}

	@Patch('me/channel')
	@UseGuards(AuthGuard)
	async updateMyChannel(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: UpdateChannelDto
	) {
		return this.channelService.updateChannel(accountId, dto)
	}

	@Post(':channelId/subscribe')
	@UseGuards(AuthGuard)
	async subscribe(
		@CurrentAccount('accountId') accountId: string,
		@Param('channelId') channelId: string
	) {
		return this.channelService.subscribe(accountId, channelId)
	}

	@Delete(':channelId/subscribe')
	@UseGuards(AuthGuard)
	async unsubscribe(
		@CurrentAccount('accountId') accountId: string,
		@Param('channelId') channelId: string
	) {
		return this.channelService.unsubscribe(accountId, channelId)
	}

	@Get('me/subscriptions')
	@UseGuards(AuthGuard)
	async getMySubscriptions(@CurrentAccount('accountId') accountId: string) {
		return this.channelService.getSubscriptions(accountId)
	}

	@Get(':channelId/videos')
	async getChannelVideos(
		@Param('channelId') channelId: string,
		@Query('page', new ParseIntPipe({ optional: true })) page = 1,
		@Query('limit', new ParseIntPipe({ optional: true })) limit = 20
	) {
		return this.channelService.getChannelVideos(channelId, page, limit)
	}
}
