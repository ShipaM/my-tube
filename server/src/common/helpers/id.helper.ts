import { randomBytes } from 'crypto'

export function generatePublicId(length = 11): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
	const bytes = randomBytes(length)
	let result = ''

	for (let i = 0; i < length; i++) {
		result += chars[bytes[i] % chars.length]
	}

	return result
}

export function generateFileName(): string {
	return randomBytes(12).toString('hex')
}
