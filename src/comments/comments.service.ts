import { PrismaService } from 'src/prisma/prisma.service'

import { Injectable } from '@nestjs/common'

import { CreateCommentDTO } from './dtos/create-comment.dto'

@Injectable()
export class CommentsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createComment(data: CreateCommentDTO) {
		const createdComment = await this.prismaService.comment.create({
			data: {
				content: data.content,
				post: { connect: { id: data.postId } },
				user: { connect: { id: data.userId } },
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
}
