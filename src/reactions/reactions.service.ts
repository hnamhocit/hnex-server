import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CreateReactionDTO } from './dtos/create-reaction.dto';

@Injectable()
export class ReactionsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createReaction(data: CreateReactionDTO, userId: string) {
		const obj = data.commentId
			? { comment: { connect: { id: data.commentId } } }
			: { post: { connect: { id: data.postId } } };

		const createdReaction = await this.prismaService.reaction.create({
			data: {
				type: data.type,
				...obj,
				user: { connect: { id: userId } },
			},
			include: {
				user: true,
			},
		});

		return { data: createdReaction };
	}

	async updateReaction(id: string, data: Prisma.ReactionUpdateInput) {
		const updatedReaction = await this.prismaService.reaction.update({
			where: { id },
			data,
			include: {
				user: true,
			},
		});

		return { data: updatedReaction };
	}
}
