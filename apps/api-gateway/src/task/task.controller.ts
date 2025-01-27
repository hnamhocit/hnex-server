import { Request } from 'express';

import { CreateTaskDTO, TASK_SERVICE_NAME, TaskServiceClient } from '@app/grpc';
import { AccessTokenGuard } from '@app/shared';
import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	OnModuleInit,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@Controller('tasks')
export class TaskController implements OnModuleInit {
	private taskService: TaskServiceClient;

	constructor(
		@Inject(TASK_SERVICE_NAME) private readonly taskClient: ClientGrpc,
	) {}

	async onModuleInit() {
		this.taskService =
			this.taskClient.getService<TaskServiceClient>(TASK_SERVICE_NAME);
	}

	@Get()
	@UseGuards(AccessTokenGuard)
	async getTasks(
		@Req() request: Request,
		@Param('cursor') cursor: string | null,
		@Param('limit') limit: string = '10',
	) {
		return this.taskService.getTasks({
			userId: request.user['sub'],
			cursor,
			limit: Number(limit),
		});
	}

	@Get(':id')
	async getTask(@Param('id') id: string) {
		return this.taskService.getTask({ id });
	}

	@Post()
	@UseGuards(AccessTokenGuard)
	createTask(@Body() data: CreateTaskDTO, @Req() request: Request) {
		return this.taskService.createTask({
			title: data.title,
			content: data.content,
			authorId: request.user['sub'],
		});
	}

	@Delete(':id')
	@UseGuards(AccessTokenGuard)
	deleteTask(@Param('id') id: string) {
		return this.taskService.deleteTask({ id });
	}

	@Patch(':id')
	@UseGuards(AccessTokenGuard)
	updateTask(@Param('id') id: string, @Body() data: Prisma.TaskUpdateInput) {
		return this.taskService.updateTask({
			id,
			title: data.title as string,
			content: data.content as string,
		});
	}
}
