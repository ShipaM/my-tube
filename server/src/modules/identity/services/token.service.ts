import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

export interface TokenPayload {
	accountId: string
	email: string
}

export interface TokenPair {
	accessToken: string
	refreshToken: string
}

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		])

		return { accessToken, refreshToken }
	}

	private async generateAccessToken(payload: TokenPayload): Promise<string> {
		const secret = this.configService.get<string>('JWT_ACCESS_SECRET')
		const expiresIn = this.configService.get('JWT_ACCESS_EXPIRATION') || '15m'

		return this.jwtService.signAsync(payload, {
			secret,
			expiresIn,
		})
	}

	private async generateRefreshToken(payload: TokenPayload): Promise<string> {
		const secret = this.configService.get<string>('JWT_REFRESH_SECRET')
		const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION') || '7d'

		return this.jwtService.signAsync(payload, {
			secret,
			expiresIn,
		})
	}

	async verifyAccessToken(token: string): Promise<TokenPayload> {
		return this.jwtService.verifyAsync<TokenPayload>(token, {
			secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
		})
	}

	async verifyRefreshToken(token: string): Promise<TokenPayload> {
		return this.jwtService.verifyAsync<TokenPayload>(token, {
			secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
		})
	}
}
