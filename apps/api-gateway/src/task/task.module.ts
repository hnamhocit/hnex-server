import { join } from 'path';

import { TASK_PACKAGE_NAME, TASK_SERVICE_NAME } from '@app/grpc';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TaskController } from './task.controller';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: TASK_SERVICE_NAME,
				transport: Transport.GRPC,
				options: {
					url: '0.0.0.0:50052',
					package: TASK_PACKAGE_NAME,
					protoPath: join(
						__dirname,
						'../../../libs/grpc/src/proto/task.proto',
					),
				},
			},
		]),
	],
	controllers: [TaskController],
})
export class TaskModule {}
