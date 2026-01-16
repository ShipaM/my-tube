import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
const registerSchema = z
	.object({
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must not exceed 100 characters'),
		confirmPassword: z.string(),
		name: z.string().min(1, 'Name is required').max(100).optional(),
		recaptchaToken: z.string().min(1, 'reCAPTCHA verification required').optional(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export class RegisterDto extends createZodDto(registerSchema) {}
const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
	recaptchaToken: z.string().min(1, 'reCAPTCHA verification required').optional(),
})

export class LoginDto extends createZodDto(loginSchema) {}
const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1, 'Refresh token is required'),
})

export class RefreshTokenDto extends createZodDto(refreshTokenSchema) {}
