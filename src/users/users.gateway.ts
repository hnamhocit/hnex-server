import { Server } from 'socket.io'

import {
    MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer
} from '@nestjs/websockets'

import { NotificationsService } from '../notifications/notifications.service'
import { UsersService } from './users.service'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class UsersGateway {
	constructor(
		private readonly usersService: UsersService,
		private readonly notificationServices: NotificationsService,
	) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('user:follow')
	async follow(
		@MessageBody('senderId') senderId: string,
		@MessageBody('receiverId') receiverId: string,
	) {
		const followed = await this.usersService.follow(senderId, receiverId);

		const createdNotification =
			await this.notificationServices.createNotification({
				message: `${followed.data.sender.displayName} followed you!`,
				receiver: { connect: { id: followed.data.receiver.id } },
			});

		this.server.emit('user:followed', followed);
		this.server.emit('notification:created', createdNotification);
	}

	@SubscribeMessage('user:unfollow')
	async unfollow(
		@MessageBody('senderId') senderId: string,
		@MessageBody('receiverId') receiverId: string,
	) {
		const followed = await this.usersService.unfollow(senderId, receiverId);

		const createdNotification =
			await this.notificationServices.createNotification({
				message: `${followed.data.sender.displayName} unfollowed you!`,
				receiver: { connect: { id: followed.data.receiver.id } },
			});

		this.server.emit('user:unfollowed', followed);
		this.server.emit('notification:created', createdNotification);
	}
}
