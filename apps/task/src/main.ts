import { join } from 'path';

import { TASK_PACKAGE_NAME } from '@app/grpc';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { TaskModule } from './task.module';

async function bootstrap() {
	const app: INestMicroservice =
		await NestFactory.createMicroservice<MicroserviceOptions>(TaskModule, {
			transport: Transport.GRPC,
			options: {
				url: '0.0.0.0:50052',
				package: TASK_PACKAGE_NAME,
				protoPath: join(
					__dirname,
					'../../../libs/grpc/src/proto/task.proto',
				),
			},
		});

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	await app.listen();
}
bootstrap();
