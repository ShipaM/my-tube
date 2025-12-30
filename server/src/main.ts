import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { ZodValidationPipe } from 'nestjs-zod'
import { AppModule } from './app.module'
import { DatabaseService } from '@core/database/database.service'
import { HttpExceptionFilter } from '@common/filters/http-exception.filter'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	const config = app.get(ConfigService)
	const db = app.get(DatabaseService)

	app.enableShutdownHooks()
	db.onModuleDestroy()

	app.useGlobalPipes(new ZodValidationPipe())
	app.useGlobalFilters(new HttpExceptionFilter())

	app.setGlobalPrefix('api')

	const isDev = config.get('NODE_ENV') !== 'production'
	app.use(
		helmet({
			contentSecurityPolicy: isDev ? false : undefined,
			crossOriginResourcePolicy: { policy: 'cross-origin' },
		})
	)
	app.use(cookieParser())

	const isProduction = config.get('NODE_ENV') === 'production'

	app.enableCors({
		origin: isProduction ? config.get('FRONTEND_URL') || 'http://localhost:3000' : true,
		credentials: true,
	})

	app.disable('x-powered-by')

	const port = config.get('PORT') || 4000
	await app.listen(port)

	console.log(`🚀 Server running on http://localhost:${port}`)
}

bootstrap()
