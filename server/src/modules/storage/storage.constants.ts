import { join } from 'path'

export const STORAGE = {
	ROOT: join(process.cwd(), 'storage'),

	PROFILES: {
		ROOT: 'profiles',
		AVATARS: 'profiles/avatars',
		BANNERS: 'profiles/banners',
	},

	CONTENT: {
		ROOT: 'content',
		PREVIEWS: 'content/previews',
		VIDEOS: 'content/videos',
	},
} as const

export type StorageFolder =
	| typeof STORAGE.PROFILES.AVATARS
	| typeof STORAGE.PROFILES.BANNERS
	| typeof STORAGE.CONTENT.PREVIEWS
	| typeof STORAGE.CONTENT.VIDEOS
