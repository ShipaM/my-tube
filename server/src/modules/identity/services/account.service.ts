import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { UpdateProfileDto, ChangePasswordDto } from '../dto/account.dto'
import * as argon2 from 'argon2'

@Injectable()
export class AccountService {
	constructor(private readonly db: DatabaseService) {}

	async findById(accountId: string) {
		const account = await this.db.account.findUnique({
			where: { id: accountId },
			select: {
				id: true,
				email: true,
				name: true,
				emailVerified: true,
				createdAt: true,
				updatedAt: true,
				channel: {
					select: {
						id: true,
						handle: true,
						bio: true,
						avatarPath: true,
						bannerPath: true,
						createdAt: true,
					},
				},
			},
		})

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		return account
	}

	async findByEmail(email: string) {
		return this.db.account.findUnique({
			where: { email },
			include: {
				channel: true,
			},
		})
	}

	async updateProfile(accountId: string, dto: UpdateProfileDto) {
		return this.db.account.update({
			where: { id: accountId },
			data: {
				name: dto.name,
				email: dto.email,
			},
			select: {
				id: true,
				email: true,
				name: true,
				emailVerified: true,
				createdAt: true,
				updatedAt: true,
			},
		})
	}

	async changePassword(accountId: string, dto: ChangePasswordDto) {
		const account = await this.db.account.findUnique({
			where: { id: accountId },
			select: { id: true, password: true },
		})

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		const isPasswordValid = await argon2.verify(account.password, dto.currentPassword)

		if (!isPasswordValid) {
			throw new Error('Current password is incorrect')
		}

		const hashedPassword = await argon2.hash(dto.newPassword)

		await this.db.account.update({
			where: { id: accountId },
			data: { password: hashedPassword },
		})

		return { message: 'Password changed successfully' }
	}

	async deleteAccount(accountId: string) {
		await this.db.account.delete({
			where: { id: accountId },
		})

		return { message: 'Account deleted successfully' }
	}
}
