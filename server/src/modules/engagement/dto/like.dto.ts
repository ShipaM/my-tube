import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
const toggleLikeSchema = z.object({
	videoId: z.string().cuid(),
})

export class ToggleLikeDto extends createZodDto(toggleLikeSchema) {}
