import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDTO } from './dtos/create-comment.dto';

@Injectable()
export class CommentsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createComment(data: CreateCommentDTO, userId: string) {
		return await this.prismaService.comment.create({
			data: {
				content: data.content,
				post: { connect: { id: data.postId } },
				user: { connect: { id: userId } },
			},
			include: {
				user: true,
			},
		});
	}
}
