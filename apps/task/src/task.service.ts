import { CreateTaskDTO } from '@app/grpc';
import { GetTasksDTO } from '@app/grpc/proto/task.pb';
import { Prisma, PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
	constructor(private readonly prisma: PrismaService) {}

	async getTasks(data: GetTasksDTO) {
		const tasks = await this.prisma.task.findMany({
			where: {
				userId: data.userId,
			},
		});
		return tasks;
	}

	async getTask(id: string) {
		const task = await this.prisma.task.findUnique({ where: { id } });
		return task;
	}

	async deleteTask(id: string) {
		const deletedTask = await this.prisma.task.delete({ where: { id } });
		return deletedTask;
	}

	async updateTask(id: string, data: Prisma.TaskUpdateInput) {
		const updatedTask = await this.prisma.task.update({
			where: { id },
			data,
		});

		return updatedTask;
	}

	async createTask(data: CreateTaskDTO) {
		const newTask = await this.prisma.task.create({
			data: {
				title: data.title,
				content: data.content,
				author: { connect: { id: data.authorId } },
			},
		});

		return newTask;
	}
}
