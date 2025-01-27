import { hash, verify } from 'argon2';

import { LoginDTO, RegisterDTO } from '@app/grpc';
import { PrismaService } from '@app/prisma';
import { JwtPayload } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async login(data: LoginDTO) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: data.email },
		});

		if (!existingUser) {
			throw new RpcException('User not found!');
		}

		const tokens = await this.getTokens({
			sub: existingUser.id,
			username: existingUser.username,
		});

		await this.updateRefreshToken(existingUser.id, tokens.refreshToken);
		return tokens;
	}

	async register(data: RegisterDTO) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: data.email },
		});

		if (existingUser) {
			throw new RpcException('User already exists!');
		}

		const hashedPassword = await hash(data.password);
		const username = data.email.split('@')[0];
		const newUser = await this.prisma.user.create({
			data: {
				email: data.email,
				displayName: data.displayName,
				password: hashedPassword,
				username,
			},
		});
		const tokens = await this.getTokens({ sub: newUser.id, username });
		await this.updateRefreshToken(newUser.id, tokens.refreshToken);

		return tokens;
	}

	private async updateRefreshToken(id: string, refreshToken: string | null) {
		await this.prisma.user.update({
			where: { id },
			data: {
				refreshToken: refreshToken ? await hash(refreshToken) : null,
			},
		});
	}

	async logout(id: string) {
		await this.updateRefreshToken(id, null);
	}

	async refreshTokens(id: string, refreshToken: string) {
		const user = await this.prisma.user.findUnique({ where: { id } });

		if (!user || !user.refreshToken) {
			throw new RpcException('Access denied!');
		}

		const isMatches = await verify(user.password, refreshToken);
		if (!isMatches) {
			throw new RpcException('Access denied!');
		}

		const tokens = await this.getTokens({
			sub: id,
			username: user.username,
		});

		await this.updateRefreshToken(id, tokens.refreshToken);
		return tokens;
	}

	private async getTokens(payload: JwtPayload) {
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
