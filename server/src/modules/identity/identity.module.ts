import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { jwtConfig } from '@core/config/jwt.config'

import { AuthController } from './controllers/auth.controller'
import { AccountController } from './controllers/account.controller'

import { AuthService } from './services/auth.service'
import { TokenService } from './services/token.service'
import { AccountService } from './services/account.service'
import { MailService } from './services/mail.service'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: jwtConfig,
		}),
	],
	controllers: [AuthController, AccountController],
	providers: [AuthService, TokenService, AccountService, MailService],
	exports: [JwtModule, TokenService, AccountService],
})
export class IdentityModule {}
