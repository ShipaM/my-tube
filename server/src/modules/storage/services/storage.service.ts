import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { promises as fs } from 'fs'
import { existsSync, mkdirSync } from 'fs'

@Injectable()
export class StorageService {
	private readonly storagePath: string

	constructor(private readonly configService: ConfigService) {
		this.storagePath = join(process.cwd(), 'storage')
		this.ensureStorageDirectories()
	}

	private ensureStorageDirectories() {
		const directories = [
			'content/videos',
			'content/previews',
			'profiles/avatars',
			'profiles/banners',
		]

		directories.forEach(dir => {
			const fullPath = join(this.storagePath, dir)
			if (!existsSync(fullPath)) {
				mkdirSync(fullPath, { recursive: true })
			}
		})
	}

	async saveFile(file: Express.Multer.File, directory: string, filename?: string): Promise<string> {
		const targetDir = join(this.storagePath, directory)

		if (!existsSync(targetDir)) {
			mkdirSync(targetDir, { recursive: true })
		}

		const finalFilename = filename || `${Date.now()}-${file.originalname}`
		const filePath = join(targetDir, finalFilename)

		await fs.writeFile(filePath, file.buffer)

		return join(directory, finalFilename)
	}

	async deleteFile(relativePath: string): Promise<void> {
		if (!relativePath) return

		const filePath = join(this.storagePath, relativePath)

		if (existsSync(filePath)) {
			await fs.unlink(filePath)
		}
	}

	getFilePath(relativePath: string): string {
		return join(this.storagePath, relativePath)
	}

	fileExists(relativePath: string): boolean {
		const filePath = join(this.storagePath, relativePath)
		return existsSync(filePath)
	}

	getPublicUrl(relativePath: string): string {
		if (!relativePath) return ''
		return `/storage/${relativePath.replace(/\\/g, '/')}`
	}
}
