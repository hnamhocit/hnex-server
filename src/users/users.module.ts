import { Module } from '@nestjs/common';

import { NotificationsService } from '../notifications/notifications.service';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateway';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	providers: [NotificationsService, UsersService, UsersGateway],
	exports: [UsersService],
})
export class UsersModule {}
