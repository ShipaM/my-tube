import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { join } from 'path'

import { DatabaseModule } from '@core/database/database.module'
import { recaptchaConfig } from '@core/config/recaptcha.config'

import { IdentityModule } from '@modules/identity/identity.module'
import { CreatorModule } from '@modules/creator/creator.module'
import { ContentModule } from '@modules/content/content.module'
import { StorageModule } from '@modules/storage/storage.module'
import { EngagementModule } from '@modules/engagement/engagement.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),

		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'storage'),
			serveRoot: '/storage',
		}),

		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: recaptchaConfig,
		}),

		DatabaseModule,

		IdentityModule,
		CreatorModule,
		ContentModule,
		StorageModule,
		EngagementModule,
	],
})
export class AppModule {}
