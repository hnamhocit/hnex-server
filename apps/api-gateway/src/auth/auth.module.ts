import { join } from 'path';

import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from '@app/grpc';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: AUTH_SERVICE_NAME,
				transport: Transport.GRPC,
				options: {
					url: '0.0.0.0:50051',
					package: AUTH_PACKAGE_NAME,
					protoPath: join(
						__dirname,
						'../../../libs/grpc/src/proto/auth.proto',
					),
				},
			},
		]),
	],
	controllers: [AuthController],
})
export class AuthModule {}
