import {
	Controller,
	Post,
	Get,
	Delete,
	Param,
	Query,
	UseGuards,
	ParseIntPipe,
} from '@nestjs/common'
import { AuthGuard } from '@core/guards/auth.guard'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { ViewService } from '../services/view.service'

@Controller('views')
@UseGuards(AuthGuard)
export class ViewController {
	constructor(private readonly viewService: ViewService) {}

	@Post('video/:videoId')
	async recordView(
		@CurrentAccount('accountId') accountId: string,
		@Param('videoId') videoId: string
	) {
		return this.viewService.recordView(accountId, videoId)
	}

	@Get('history')
	async getWatchHistory(
		@CurrentAccount('accountId') accountId: string,
		@Query('page', new ParseIntPipe({ optional: true })) page = 1,
		@Query('limit', new ParseIntPipe({ optional: true })) limit = 20
	) {
		return this.viewService.getWatchHistory(accountId, page, limit)
	}

	@Delete('history')
	async clearWatchHistory(@CurrentAccount('accountId') accountId: string) {
		return this.viewService.clearWatchHistory(accountId)
	}
}
