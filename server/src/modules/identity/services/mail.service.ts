import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name)
	private mailgunClient: any

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.get<string>('MAILGUN_API_KEY')
		const domain = this.configService.get<string>('MAILGUN_DOMAIN')

		if (apiKey && domain) {
			const mailgun = new Mailgun(FormData)
			this.mailgunClient = mailgun.client({ username: 'api', key: apiKey })
		} else {
			this.logger.warn('Mailgun not configured. Emails will be logged instead.')
		}
	}

	async sendVerificationEmail(email: string, token: string): Promise<void> {
		const verificationUrl = `${this.configService.get<string>('FRONTEND_URL')}/auth/verify?token=${token}`

		const subject = 'Verify your email address'
		const html = `
			<h1>Welcome to MyTube!</h1>
			<p>Please verify your email address by clicking the link below:</p>
			<a href="${verificationUrl}">${verificationUrl}</a>
			<p>If you didn't create an account, you can safely ignore this email.</p>
		`

		await this.sendEmail(email, subject, html)
	}

	async sendPasswordResetEmail(email: string, token: string): Promise<void> {
		const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/auth/reset-password?token=${token}`

		const subject = 'Reset your password'
		const html = `
			<h1>Password Reset Request</h1>
			<p>You requested to reset your password. Click the link below to proceed:</p>
			<a href="${resetUrl}">${resetUrl}</a>
			<p>This link will expire in 1 hour.</p>
			<p>If you didn't request this, you can safely ignore this email.</p>
		`

		await this.sendEmail(email, subject, html)
	}

	private async sendEmail(to: string, subject: string, html: string): Promise<void> {
		const from = this.configService.get<string>('MAIL_FROM', 'noreply@mytube.com')
		const domain = this.configService.get<string>('MAILGUN_DOMAIN')

		if (!this.mailgunClient || !domain) {
			this.logger.log(`
				[EMAIL] Would send to: ${to}
				Subject: ${subject}
				Body: ${html}
			`)
			return
		}

		try {
			await this.mailgunClient.messages.create(domain, {
				from,
				to,
				subject,
				html,
			})

			this.logger.log(`Email sent successfully to ${to}`)
		} catch (error) {
			this.logger.error(`Failed to send email to ${to}:`, error)
			throw error
		}
	}
}
