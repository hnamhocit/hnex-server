import { join } from 'path';

import { AUTH_PACKAGE_NAME } from '@app/grpc';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AuthModule } from './auth.module';

async function bootstrap() {
	const app: INestMicroservice =
		await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
			transport: Transport.GRPC,
			options: {
				url: '0.0.0.0:50051',
				package: AUTH_PACKAGE_NAME,
				protoPath: join(
					__dirname,
					'../../../libs/grpc/src/proto/auth.proto',
				),
			},
		});

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	await app.listen();
}
bootstrap();
