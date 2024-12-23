import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
	constructor(private readonly prismaService: PrismaService) {}

	async getPosts() {
		const posts = await this.prismaService.post.findMany({
			include: {
				user: true,
				media: {
					select: {
						id: true,
						type: true,
					},
				},
				reactions: {
					select: {
						id: true,
						name: true,
					},
				},
				_count: {
					select: { comments: true },
				},
			},
		});

		return { data: posts };
	}

	async getPostDetail(id: string) {
		const post = await this.prismaService.post.findUnique({
			where: { id },
			include: {
				user: true,
				comments: true,
				reactions: true,
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
