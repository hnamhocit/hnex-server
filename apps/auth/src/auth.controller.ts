import { AUTH_SERVICE_NAME, LoginDTO, LogoutDTO, RegisterDTO } from '@app/grpc';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@GrpcMethod(AUTH_SERVICE_NAME, 'Login')
	async login(request: LoginDTO) {
		return await this.authService.login(request);
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'Register')
	async register(request: RegisterDTO) {
		return await this.authService.register(request);
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'Logout')
	async logout(request: LogoutDTO) {
		return await this.authService.logout(request.userId);
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'RefreshTokens')
	async refreshTokens({
		userId,
		refreshToken,
	}: {
		userId: string;
		refreshToken: string;
	}) {
		return await this.authService.refreshTokens(userId, refreshToken);
	}
}
