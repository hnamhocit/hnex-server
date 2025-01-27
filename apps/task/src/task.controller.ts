import { CreateTaskDTO, TASK_SERVICE_NAME } from '@app/grpc';
import { GetTasksDTO } from '@app/grpc/proto/task.pb';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@GrpcMethod(TASK_SERVICE_NAME, 'GetTasks')
	async getTasks(data: GetTasksDTO) {
		return await this.taskService.getTasks(data);
	}

	@GrpcMethod(TASK_SERVICE_NAME, 'GetTask')
	async getTask(data: { id: string }) {
		return await this.taskService.getTask(data.id);
	}

	@GrpcMethod(TASK_SERVICE_NAME, 'CreateTask')
	async createTask(data: CreateTaskDTO) {
		return await this.taskService.createTask(data);
	}

	@GrpcMethod(TASK_SERVICE_NAME, 'DeleteTask')
	async deleteTask(id: string) {
		return await this.taskService.deleteTask(id);
	}

	@GrpcMethod(TASK_SERVICE_NAME, 'UpdateTask')
	async updateTask(data: { id: string; data: Prisma.TaskUpdateInput }) {
		return await this.taskService.updateTask(data.id, data.data);
	}
}
