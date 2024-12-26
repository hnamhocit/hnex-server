import { Injectable } from '@nestjs/common';
import { MediaType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
	constructor(private readonly prismaService: PrismaService) {}

	async upload(file: Express.Multer.File, userId: string) {
		const uploadedFile = await this.prismaService.media.create({
			data: {
				name: file.originalname,
				size: file.size,
				contentType: file.mimetype,
				buffer: file.buffer,
				type: file.mimetype.split('/')[0].toUpperCase() as MediaType,
				user: { connect: { id: userId } },
			},
		});

		return { data: uploadedFile };
	}

	async findMany() {
		const media = await this.prismaService.media.findMany();
		return { data: media };
	}

	async getUploadMedia(id: string) {
		const media = await this.prismaService.media.findUnique({
			where: { id },
		});
		return { data: media };
	}
}
