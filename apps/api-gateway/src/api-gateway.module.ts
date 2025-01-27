import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';

@Module({
	imports: [AuthModule, TaskModule],
})
export class ApiGatewayModule {}
