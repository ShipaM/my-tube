import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { JwtPayload } from './auth.guard'

@Injectable()
export class OptionalAuthGuard implements CanActivate {
	constructor(
		private readonly jwt: JwtService,
		private readonly config: ConfigService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>()
		const token = this.extractToken(request)

		if (!token) {
			return true
		}

		try {
			const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
				secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
			})

			request['account'] = payload
		} catch {}

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
