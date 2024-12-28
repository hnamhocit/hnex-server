import { Request } from 'express'

import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { AccessTokenGuard } from '../common/guards/access-token.guard'
import { CreateReactionDTO } from './dtos/create-reaction.dto'
import { ReactionsService } from './reactions.service'

@Controller('reactions')
export class ReactionsController {
	constructor(private readonly reactionsService: ReactionsService) {}

	@Post()
	@UseGuards(AccessTokenGuard)
	async createReaction(@Body() data: CreateReactionDTO, @Req() req: Request) {
		return await this.reactionsService.createReaction(
			data,
			req.user['sub'],
		);
	}

	@Patch(':id')
	@UseGuards(AccessTokenGuard)
	async updateReaction(
		@Param('id') id: string,
		@Body() data: Prisma.ReactionUpdateInput,
	) {
		return await this.reactionsService.updateReaction(id, data);
	}
}
