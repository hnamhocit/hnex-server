import { Module } from '@nestjs/common';

import { ReactionsController } from './reactions.controller';
import { ReactionsGateway } from './reactions.gateway';
import { ReactionsService } from './reactions.service';

@Module({
	controllers: [ReactionsController],
	providers: [ReactionsService, ReactionsGateway],
})
export class ReactionsModule {}
