import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload } from '@core/guards/auth.guard'

export const CurrentAccount = createParamDecorator(
	(data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const account = request.account as JwtPayload

		return data ? account?.[data] : account
	}
)
