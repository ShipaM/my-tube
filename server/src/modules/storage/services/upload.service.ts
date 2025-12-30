import { Injectable, BadRequestException } from '@nestjs/common'
import { StorageService } from './storage.service'
import { DatabaseService } from '@core/database/database.service'

@Injectable()
export class UploadService {
	constructor(
		private readonly storageService: StorageService,
		private readonly db: DatabaseService
	) {}

	async uploadVideoThumbnail(videoId: string, file: Express.Multer.File) {
		if (!file.mimetype.startsWith('image/')) {
			throw new BadRequestException('File must be an image')
		}

		const video = await this.db.video.findUnique({
			where: { id: videoId },
		})

		if (!video) {
			throw new BadRequestException('Video not found')
		}

		if (video.thumbnailPath) {
			await this.storageService.deleteFile(video.thumbnailPath)
		}

		const filename = `${videoId}-${Date.now()}.jpg`
		const relativePath = await this.storageService.saveFile(file, 'content/previews', filename)

		await this.db.video.update({
			where: { id: videoId },
			data: { thumbnailPath: relativePath },
		})

		return {
			path: relativePath,
			url: this.storageService.getPublicUrl(relativePath),
		}
	}

	async uploadChannelAvatar(channelId: string, file: Express.Multer.File) {
		if (!file.mimetype.startsWith('image/')) {
			throw new BadRequestException('File must be an image')
		}

		const channel = await this.db.channel.findUnique({
			where: { id: channelId },
		})

		if (!channel) {
			throw new BadRequestException('Channel not found')
		}

		if (channel.avatarPath) {
			await this.storageService.deleteFile(channel.avatarPath)
		}

		const filename = `${channelId}-avatar-${Date.now()}.jpg`
		const relativePath = await this.storageService.saveFile(file, 'profiles/avatars', filename)

		await this.db.channel.update({
			where: { id: channelId },
			data: { avatarPath: relativePath },
		})

		return {
			path: relativePath,
			url: this.storageService.getPublicUrl(relativePath),
		}
	}

	async uploadChannelBanner(channelId: string, file: Express.Multer.File) {
		if (!file.mimetype.startsWith('image/')) {
			throw new BadRequestException('File must be an image')
		}

		const channel = await this.db.channel.findUnique({
			where: { id: channelId },
		})

		if (!channel) {
			throw new BadRequestException('Channel not found')
		}

		if (channel.bannerPath) {
			await this.storageService.deleteFile(channel.bannerPath)
		}

		const filename = `${channelId}-banner-${Date.now()}.jpg`
		const relativePath = await this.storageService.saveFile(file, 'profiles/banners', filename)

		await this.db.channel.update({
			where: { id: channelId },
			data: { bannerPath: relativePath },
		})

		return {
			path: relativePath,
			url: this.storageService.getPublicUrl(relativePath),
		}
	}

	async uploadVideoFile(videoId: string, file: Express.Multer.File) {
		if (!file.mimetype.startsWith('video/')) {
			throw new BadRequestException('File must be a video')
		}

		const video = await this.db.video.findUnique({
			where: { id: videoId },
		})

		if (!video) {
			throw new BadRequestException('Video not found')
		}

		if (video.videoFileName) {
			const oldPath = `content/videos/${video.videoFileName}`
			await this.storageService.deleteFile(oldPath)
		}

		const filename = `${videoId}-${Date.now()}.mp4`
		const relativePath = await this.storageService.saveFile(file, 'content/videos', filename)

		await this.db.video.update({
			where: { id: videoId },
			data: {
				videoFileName: filename,
				maxQuality: '1080p',
			},
		})

		return {
			path: relativePath,
			url: this.storageService.getPublicUrl(relativePath),
			filename,
		}
	}
}
