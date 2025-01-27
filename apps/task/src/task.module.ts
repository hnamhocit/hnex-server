import { PrismaModule } from '@app/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
	controllers: [TaskController],
	providers: [TaskService],
})
export class TaskModule {}
