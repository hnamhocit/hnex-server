import { Request } from 'express';

import {
	AUTH_SERVICE_NAME,
	AuthServiceClient,
	LoginDTO,
	RegisterDTO,
} from '@app/grpc';
import { AccessTokenGuard, RefreshTokenGuard } from '@app/shared';
import {
	Body,
	Controller,
	Get,
	Inject,
	OnModuleInit,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('auth')
export class AuthController implements OnModuleInit {
	private authService: AuthServiceClient;

	constructor(
		@Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientGrpc,
	) {}

	public onModuleInit() {
		this.authService =
			this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
	}

	@Post('login')
	login(@Body() data: LoginDTO) {
		return this.authService.login(data);
	}

	@Post('register')
	register(@Body() data: RegisterDTO) {
		return this.authService.register(data);
	}

	@Get('logout')
	@UseGuards(AccessTokenGuard)
	logout(@Req() request: Request) {
		return this.authService.logout(request.user['sub']);
	}

	@Get('refreshTokens')
	@UseGuards(RefreshTokenGuard)
	refreshTokens(@Req() request: Request) {
		return this.authService.refreshTokens({
			userId: request.user['sub'],
			refreshToken: request.user['refreshToken'],
		});
	}
}
