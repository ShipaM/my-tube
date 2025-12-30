import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const PaginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
})

export class PaginationDto extends createZodDto(PaginationSchema) {}

export interface PaginatedResult<T> {
	data: T[]
	meta: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
	}
}

export function createPaginatedResult<T>(
	data: T[],
	total: number,
	page: number,
	limit: number
): PaginatedResult<T> {
	const totalPages = Math.ceil(total / limit)

	return {
		data,
		meta: {
			page,
			limit,
			total,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		},
	}
}
