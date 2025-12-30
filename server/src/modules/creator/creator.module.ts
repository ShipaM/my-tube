import { Module } from '@nestjs/common'
import { ChannelController } from './controllers/channel.controller'
import { ChannelService } from './services/channel.service'
import { IdentityModule } from '../identity/identity.module'

@Module({
	imports: [IdentityModule],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService],
})
export class CreatorModule {}
