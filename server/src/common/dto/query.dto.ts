import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const PaginationQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
})

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

export const SearchQuerySchema = PaginationQuerySchema.extend({
	search: z.string().optional(),
})

export class SearchQueryDto extends createZodDto(SearchQuerySchema) {}
