import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from 'src/users/users.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { PrismaService } from '../prisma/prisma.service';
import { generateOTP } from '../utils/generateOTP';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
	constructor(
		private readonly mailsService: MailsService,
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService,
	) {}

	@Post('send-otp')
	@UseGuards(AccessTokenGuard)
	async sendOTP(@Req() req: Request) {
		const userId = req.user['sub'];
		const { data } = await this.usersService.getProfile(userId);

		const otp = generateOTP();
		const fiveMinuteLater = new Date(Date.now() + 5 * 60 * 1000);

		await this.mailsService.sendActivationMail(
			data.email,
			data.displayName,
			otp,
		);

		return await this.usersService.update(userId, {
			activationCode: otp,
			actionationCodeExpiredIn: fiveMinuteLater,
		});
	}
}
