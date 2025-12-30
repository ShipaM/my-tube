import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
const updateChannelSchema = z.object({
	handle: z
		.string()
		.min(3, 'Handle must be at least 3 characters')
		.max(30, 'Handle must not exceed 30 characters')
		.regex(/^[a-z0-9_]+$/, 'Handle can only contain lowercase letters, numbers, and underscores')
		.optional(),
	bio: z.string().max(1000, 'Bio must not exceed 1000 characters').optional(),
})

export class UpdateChannelDto extends createZodDto(updateChannelSchema) {}
const subscribeSchema = z.object({
	channelId: z.string().cuid(),
})

export class SubscribeDto extends createZodDto(subscribeSchema) {}
