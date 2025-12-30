import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
const createCommentSchema = z.object({
	text: z.string().min(1).max(1000),
	videoId: z.string().cuid(),
})

export class CreateCommentDto extends createZodDto(createCommentSchema) {}
const updateCommentSchema = z.object({
	text: z.string().min(1).max(1000),
})

export class UpdateCommentDto extends createZodDto(updateCommentSchema) {}
