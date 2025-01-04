import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	async getProfile(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: {
				followings: true,
				notifications: true,
				followers: true,
				media: {
					select: {
						id: true,
						contentType: true,
					},
				},
				posts: {
					include: {
						user: {
							include: { followers: true, followings: true },
						},
						media: {
							select: {
								id: true,
								contentType: true,
							},
						},
						reactions: {
							select: {
								id: true,
								type: true,
								user: true,
							},
						},
						_count: {
							select: { comments: true },
						},
					},
				},
				comments: {
					include: {
						user: true,
						media: {
							select: {
								id: true,
								contentType: true,
							},
						},
						reactions: {
							select: {
								id: true,
								type: true,
								user: true,
							},
						},
					},
				},
			},
		});

		return { data: user };
	}

	async delete(id: string) {
		const user = await this.prismaService.user.delete({ where: { id } });

		return { data: user };
	}

	async logout(id: string) {
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

	async follow(senderId: string, receiverId: string) {
		// followerId is sender, followingId is receiver
		const sender = await this.prismaService.user.update({
			where: {
				id: senderId,
			},
			data: {
				followings: { connect: { id: receiverId } },
			},
			include: { followings: true, notifications: true, followers: true },
		});

		const receiver = await this.prismaService.user.update({
			where: { id: receiverId },
			data: {
				followers: { connect: { id: senderId } },
			},
			include: { followings: true, notifications: true, followers: true },
		});

		return { data: { sender, receiver } };
	}

	async unfollow(senderId: string, receiverId: string) {
		// followerId is sender, followingId is receiver
		const sender = await this.prismaService.user.update({
			where: {
				id: senderId,
			},
			data: {
				followings: { disconnect: { id: receiverId } },
			},
			include: { followings: true, notifications: true, followers: true },
		});

		const receiver = await this.prismaService.user.update({
			where: { id: receiverId },
			data: {
				followers: { disconnect: { id: senderId } },
			},
			include: { followings: true, notifications: true, followers: true },
		});

		return { data: { sender, receiver } };
	}
}
