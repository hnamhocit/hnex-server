import { hash, verify } from 'argon2';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { MailsService } from '../mails/mails.service';
import { PrismaService } from '../prisma/prisma.service';
import { generateOTP } from '../utils/generateOTP';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly mailsService: MailsService,
	) {}

	async login(loginDto: LoginDto) {
		const existingUser = await this.prismaService.user.findUnique({
			where: { email: loginDto.email },
		});

		if (!existingUser) {
			return {
				code: 404,
				error: `User with email ${loginDto.email} not found!`,
			};
		}

		const pwMatches = await verify(
			existingUser.password,
			loginDto.password,
		);

		if (!pwMatches) {
			return {
				code: 400,
				error: 'Password is incorrect!',
			};
		}

		const tokens = await this.getTokens(existingUser);
		this.updateRefreshToken(existingUser.id, tokens.refreshToken);

		return { code: 200, data: tokens };
	}

	async register(registerDto: RegisterDto) {
		const existingUser = await this.prismaService.user.findUnique({
			where: { email: registerDto.email },
		});

		if (existingUser) {
			return {
				code: 409,
				error: 'User already exists!',
			};
		}

		const hashedPassword = await hash(registerDto.password);
		const OTP = generateOTP();
		const fiveMinuteLater = new Date(Date.now() + 5 * 60 * 1000);

		const newUser = await this.prismaService.user.create({
			data: {
				...registerDto,
				password: hashedPassword,
				activationCode: OTP,
				actionationCodeExpiredIn: fiveMinuteLater,
				username: registerDto.email.split('@')[0],
			},
		});

		await this.mailsService.sendActivationMail(
			newUser.email,
			newUser.displayName,
			OTP,
		);

		const tokens = await this.getTokens(newUser);
		await this.updateRefreshToken(newUser.id, tokens.refreshToken);

		return { code: 201, data: tokens };
	}

	async logout(id: string) {
		await this.updateRefreshToken(id, null);
	}

	async refresh(id: string, refreshToken: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!user || !user.refreshToken) {
			return {
				code: 401,
				error: 'Access denied!',
			};
		}

		const refreshTokenMatches = await verify(
			user.refreshToken,
			refreshToken,
		);

		if (!refreshTokenMatches) {
			return {
				code: 401,
				error: 'Access denied!',
			};
		}

		const tokens = await this.getTokens(user);
		await this.updateRefreshToken(id, tokens.refreshToken);

		return { code: 200, data: tokens };
	}

	async updateRefreshToken(id: string, refreshToken: string | null) {
		let hashedRefreshToken: string;
		if (refreshToken) {
			hashedRefreshToken = await hash(refreshToken);
		}

		await this.prismaService.user.update({
			where: { id },
			data: {
				refreshToken: refreshToken ? hashedRefreshToken : refreshToken,
			},
		});
	}

	async getTokens(user: User) {
		const payload = { sub: user.id, email: user.email };

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.configService.get('JWT_ACCESS_SECRET'),
				expiresIn: this.configService.get('JWT_ACCESS_EXPIRESIN'),
			}),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get('JWT_REFRESH_SECRET'),
				expiresIn: this.configService.get('JWT_REFRESH_EXPIRESIN'),
			}),
		]);

		return { accessToken, refreshToken };
	}
}
