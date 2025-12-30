import { Module } from '@nestjs/common'
import { UploadController } from './controllers/upload.controller'
import { StorageService } from './services/storage.service'
import { UploadService } from './services/upload.service'
import { IdentityModule } from '../identity/identity.module'

@Module({
	imports: [IdentityModule],
	controllers: [UploadController],
	providers: [StorageService, UploadService],
	exports: [StorageService, UploadService],
})
export class StorageModule {}
