import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

export const recaptchaConfig = (config: ConfigService): GoogleRecaptchaModuleOptions => {
	const secretKey = config.get('RECAPTCHA_SECRET_KEY')
	const isDev = config.get('NODE_ENV') !== 'production'

	return {
		secretKey: secretKey || 'dummy-key-for-dev',
		response: req => req.headers.recaptcha,
		skipIf: () => isDev || !secretKey,
	}
}
