import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { Response } from '../common/interceptors/transform.interceptor';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	async getProfile(id: string): Promise<Response<User>> {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		return { data: user };
	}

	async delete(id: string): Promise<Response<User>> {
		const user = await this.prismaService.user.delete({ where: { id } });

		return { data: user };
	}

	async logout(id: string): Promise<Response<User>> {
		const user = await this.prismaService.user.update({
			where: { id },
			data: { refreshToken: null },
		});

		return { data: user };
	}

	async update(id: string, data: Prisma.UserUpdateInput) {
		const user = await this.prismaService.user.update({
			where: { id },
			data,
		});

		return { data: user };
	}

	async getUsers() {
		const users = await this.prismaService.user.findMany();
		return { data: users };
	}
}
