import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@core/guards/auth.guard'

export const Auth = () => applyDecorators(UseGuards(AuthGuard))
