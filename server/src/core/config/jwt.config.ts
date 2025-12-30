import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export const jwtConfig = (config: ConfigService): JwtModuleOptions => ({
	secret: config.getOrThrow('JWT_ACCESS_SECRET'),
	signOptions: {
		expiresIn: '15m',
	},
})
