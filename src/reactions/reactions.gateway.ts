import { Server } from 'socket.io';

import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { $Enums } from '@prisma/client';

import { CreateReactionDTO } from './dtos/create-reaction.dto';
import { ReactionsService } from './reactions.service';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class ReactionsGateway {
	constructor(private readonly reactionsService: ReactionsService) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('reaction:create')
	async createReaction(
		@MessageBody('data') data: CreateReactionDTO,
		@MessageBody('userId') userId: string,
	) {
		const createdReaction = await this.reactionsService.createReaction(
			data,
			userId,
		);
		this.server.emit('reaction:created', createdReaction);
	}

	@SubscribeMessage('reaction:update')
	async updateReaction(
		@MessageBody('type') type: $Enums.ReactionType,
		@MessageBody('id') id: string,
	) {
		const updatedReaction = await this.reactionsService.updateReaction(id, {
			type,
		});
		this.server.emit('reaction:updated', updatedReaction);
	}
}
