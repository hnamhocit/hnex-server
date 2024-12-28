import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dtos/create-comment.dto';

@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Post()
	@UseGuards(AccessTokenGuard)
	async createComment(@Body() data: CreateCommentDTO, @Req() req: Request) {
		return await this.commentsService.createComment(data, req.user['sub']);
	}
}
