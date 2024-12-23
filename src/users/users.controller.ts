import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getUsers() {
		return await this.usersService.getUsers();
	}

	@UseGuards(AccessTokenGuard)
	@Get('me')
	async getMe(@Req() req: Request) {
		return await this.usersService.getProfile(req.user['sub']);
	}

	@UseGuards(AccessTokenGuard)
	@Get('me/logout')
	async meLogout(@Req() req: Request) {
		return await this.usersService.logout(req.user['sub']);
	}

	@UseGuards(AccessTokenGuard)
	@Delete('me')
	async deleteMe(@Req() req: Request) {
		return await this.usersService.delete(req.user['sub']);
	}

	@UseGuards(AccessTokenGuard)
	@Patch('me')
	async updateMe(@Req() req: Request, @Body() body: Prisma.UserUpdateInput) {
		return await this.usersService.update(req.user['sub'], body);
	}
}
