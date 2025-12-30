import { Module } from '@nestjs/common'
import { VideoController } from './controllers/video.controller'
import { CommentController } from './controllers/comment.controller'
import { VideoService } from './services/video.service'
import { CommentService } from './services/comment.service'
import { IdentityModule } from '../identity/identity.module'
import { StorageModule } from '../storage/storage.module'

@Module({
	imports: [IdentityModule, StorageModule],
	controllers: [VideoController, CommentController],
	providers: [VideoService, CommentService],
	exports: [VideoService, CommentService],
})
export class ContentModule {}
