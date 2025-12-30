import { Module } from '@nestjs/common'
import { LikeController } from './controllers/like.controller'
import { ViewController } from './controllers/view.controller'
import { LikeService } from './services/like.service'
import { ViewService } from './services/view.service'
import { IdentityModule } from '../identity/identity.module'

@Module({
	imports: [IdentityModule],
	controllers: [LikeController, ViewController],
	providers: [LikeService, ViewService],
	exports: [LikeService, ViewService],
})
export class EngagementModule {}
