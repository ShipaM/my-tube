import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
const updateProfileSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().optional(),
})

export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z.string().min(8, 'Password must be at least 8 characters').max(100),
		confirmPassword: z.string(),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
