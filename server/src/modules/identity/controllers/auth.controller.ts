import { Controller, Post, Body, Res, HttpCode, HttpStatus, Get, Query } from '@nestjs/common'
import { Response } from 'express'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { AuthService } from '../services/auth.service'
import { RegisterDto, LoginDto, RefreshTokenDto } from '../dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@Recaptcha({ response: req => req.body.recaptchaToken })
	async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		const result = await this.authService.register(dto)

		this.setRefreshTokenCookie(res, result.refreshToken)

		return {
			account: result.account,
			accessToken: result.accessToken,
		}
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@Recaptcha({ response: req => req.body.recaptchaToken })
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		console.log(dto)
		const result = await this.authService.login(dto)

		this.setRefreshTokenCookie(res, result.refreshToken)

		return {
			account: result.account,
			accessToken: result.accessToken,
		}
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
		const result = await this.authService.refreshToken(dto.refreshToken)

		this.setRefreshTokenCookie(res, result.refreshToken)

		return {
			accessToken: result.accessToken,
		}
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		})

		return { message: 'Logged out successfully' }
	}

	@Get('verify')
	async verifyEmail(@Query('token') token: string) {
		return this.authService.verifyEmail(token)
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string): void {
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})
	}
}
