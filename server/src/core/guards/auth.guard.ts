import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

export interface JwtPayload {
	accountId: string
	email: string
	iat?: number
	exp?: number
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwt: JwtService,
		private readonly config: ConfigService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>()
		const token = this.extractToken(request)

		if (!token) {
			throw new UnauthorizedException('Access token required')
		}

		try {
			const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
				secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
			})

			request['account'] = payload
		} catch {
			throw new UnauthorizedException('Invalid or expired token')
		}

		return true
	}

	private extractToken(request: Request): string | undefined {
		const cookieToken = request.cookies?.accessToken

		if (cookieToken) {
			return cookieToken
		}

		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}
