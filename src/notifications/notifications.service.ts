import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createNotification(data: Prisma.NotificationCreateInput) {
		const createdNotification =
			await this.prismaService.notification.create({
				data,
			});

		return { data: createdNotification };
	}
}
