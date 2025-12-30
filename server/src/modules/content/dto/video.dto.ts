import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
const createVideoSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().max(5000).optional().default(''),
	isPublished: z.boolean().optional().default(false),
})

export class CreateVideoDto extends createZodDto(createVideoSchema) {}
const updateVideoSchema = z.object({
	title: z.string().min(1).max(100).optional(),
	description: z.string().max(5000).optional(),
	isPublished: z.boolean().optional(),
})

export class UpdateVideoDto extends createZodDto(updateVideoSchema) {}
const videoQuerySchema = z.object({
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().max(50).optional().default(20),
	search: z.string().optional(),
	excludeIds: z.array(z.string()).optional(),
})

export class VideoQueryDto extends createZodDto(videoQuerySchema) {}
