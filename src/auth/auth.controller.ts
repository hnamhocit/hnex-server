import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() loginDto: LoginDto) {
		return await this.authService.login(loginDto);
	}

	@Post('register')
	async register(@Body() registerDto: RegisterDto) {
		return await this.authService.register(registerDto);
	}

	@Get('logout')
	@UseGuards(AccessTokenGuard)
	async logout(@Req() req: Request) {
		return await this.authService.logout(req.user['sub']);
	}

	@Get('refresh')
	@UseGuards(RefreshTokenGuard)
	async refresh(@Req() req: Request) {
		return await this.authService.refresh(
			req.user['sub'],
			req.user['refreshToken'],
		);
	}
}
