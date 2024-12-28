import { Server } from 'socket.io';

import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Prisma } from '@prisma/client';

import { PostsService } from './posts.service';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class PostsGateway {
	constructor(private readonly postsService: PostsService) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('post:update')
	async updatePost(
		@MessageBody('id') id: string,
		@MessageBody('data') data: Prisma.PostUpdateInput,
	) {
		const updatedPost = await this.postsService.updatePost(id, data);
		this.server.emit('post:updated', updatedPost);
	}

	@SubscribeMessage('post:delete')
	async deletePost(@MessageBody('id') id: string) {
		const deletedPost = await this.postsService.deletePost(id);
		this.server.emit('post:deleted', deletedPost);
	}

	@SubscribeMessage('post:create')
	async createPost(
		@MessageBody('data')
		data: Prisma.PostCreateInput & { mediaIds: string[] },
		@MessageBody('userId') userId: string,
	) {
		const createdPost = await this.postsService.createPost(data, userId);
		this.server.emit('post:created', createdPost);
	}
}
