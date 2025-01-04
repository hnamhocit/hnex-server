import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.setGlobalPrefix('api/v1');
	app.useGlobalInterceptors(new TransformInterceptor());
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
