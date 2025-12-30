import {
	Controller,
	Post,
	Param,
	UseGuards,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@core/guards/auth.guard'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { UploadService } from '../services/upload.service'

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post('video/:videoId/thumbnail')
	@UseInterceptors(FileInterceptor('file'))
	async uploadVideoThumbnail(
		@Param('videoId') videoId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
					new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|webp)/ }),
				],
			})
		)
		file: Express.Multer.File
	) {
		return this.uploadService.uploadVideoThumbnail(videoId, file)
	}

	@Post('video/:videoId/file')
	@UseInterceptors(FileInterceptor('file'))
	async uploadVideoFile(
		@Param('videoId') videoId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }),
					new FileTypeValidator({ fileType: /video\/(mp4|webm|ogg)/ }),
				],
			})
		)
		file: Express.Multer.File
	) {
		return this.uploadService.uploadVideoFile(videoId, file)
	}

	@Post('channel/:channelId/avatar')
	@UseInterceptors(FileInterceptor('file'))
	async uploadChannelAvatar(
		@Param('channelId') channelId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
					new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|webp)/ }),
				],
			})
		)
		file: Express.Multer.File
	) {
		return this.uploadService.uploadChannelAvatar(channelId, file)
	}

	@Post('channel/:channelId/banner')
	@UseInterceptors(FileInterceptor('file'))
	async uploadChannelBanner(
		@Param('channelId') channelId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
					new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|webp)/ }),
				],
			})
		)
		file: Express.Multer.File
	) {
		return this.uploadService.uploadChannelBanner(channelId, file)
	}
}
