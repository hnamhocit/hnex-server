import { Server } from 'socket.io'

import {
    MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer
} from '@nestjs/websockets'

import { CommentsService } from './comments.service'
import { CreateCommentDTO } from './dtos/create-comment.dto'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class CommentsGateway {
	constructor(private readonly commentsService: CommentsService) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('comment:create')
	async createComment(@MessageBody() data: CreateCommentDTO) {
		const createdComment = await this.commentsService.createComment(data);
		this.server.emit('comment:created', createdComment);
	}
}
