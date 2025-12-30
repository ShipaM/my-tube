import { Controller, Get, Patch, Delete, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@core/guards/auth.guard'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { AccountService } from '../services/account.service'
import { UpdateProfileDto, ChangePasswordDto } from '../dto/account.dto'

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get('me')
	async getProfile(@CurrentAccount('accountId') accountId: string) {
		return this.accountService.findById(accountId)
	}

	@Patch('profile')
	async updateProfile(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: UpdateProfileDto
	) {
		return this.accountService.updateProfile(accountId, dto)
	}

	@Patch('password')
	async changePassword(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: ChangePasswordDto
	) {
		return this.accountService.changePassword(accountId, dto)
	}

	@Delete()
	async deleteAccount(@CurrentAccount('accountId') accountId: string) {
		return this.accountService.deleteAccount(accountId)
	}
}
