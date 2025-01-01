import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

import { CreateCommentDTO } from './dtos/create-comment.dto';

@Injectable()
export class CommentsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createComment(data: CreateCommentDTO) {
		const obj = data.parentId
			? { parentComment: { connect: { id: data.parentId } } }
			: {};

		const createdComment = await this.prismaService.comment.create({
			data: {
				content: data.content,
				post: { connect: { id: data.postId } },
				user: { connect: { id: data.userId } },
				...obj,
				media: {
					connect: [...data.mediaIds.map((id) => ({ id }))],
				},
			},
			include: {
				user: true,
				media: true,
			},
		});

		return { data: createdComment };
	}

	async deleteComment(id: string) {
		const deletedComment = await this.prismaService.comment.delete({
			where: { id },
		});
		return { data: deletedComment };
	}
}
