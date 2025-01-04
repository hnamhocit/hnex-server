import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
	constructor(private readonly prismaService: PrismaService) {}

	async getPosts(cursor?: string) {
		const posts = await this.prismaService.post.findMany({
			take: 10,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined,
			orderBy: {
				createdAt: 'desc',
			},
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
		});

		const hasNext = posts.length === 10;

		return {
			data: {
				posts,
				cursor: hasNext ? posts[posts.length - 1].id : undefined,
				hasNext,
			},
		};
	}

	async getPostDetail(id: string) {
		const post = await this.prismaService.post.findUnique({
			where: { id },
			include: {
				user: {
					include: {
						followers: true,
						followings: true,
					},
				},
				media: {
					select: { id: true, contentType: true },
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
				reactions: {
					select: {
						id: true,
						type: true,
						user: true,
					},
				},
			},
		});

		return { data: post };
	}

	async createPost(
		data: Prisma.PostCreateInput & { mediaIds: string[] },
		userId: string,
	) {
		const createdPost = await this.prismaService.post.create({
			data: {
				content: data.content,
				user: { connect: { id: userId } },
				media: {
					connect: [...data.mediaIds.map((id) => ({ id }))],
				},
			},
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
				_count: {
					select: { comments: true },
				},
			},
		});

		return { data: createdPost };
	}

	async deletePost(id: string) {
		const deletedPost = await this.prismaService.post.delete({
			where: { id },
		});

		return { data: deletedPost };
	}

	async updatePost(id: string, data: Prisma.PostUpdateInput) {
		const updatedPost = await this.prismaService.post.update({
			where: { id },
			data,
		});

		return { updatedPost };
	}
}
