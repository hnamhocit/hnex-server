import {
	Controller,
	Get,
	Param,
	Post,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Get('')
	async getMedia() {
		return await this.mediaService.findMany();
	}

	@Post('upload')
	@UseGuards(AccessTokenGuard)
	@UseInterceptors(FileInterceptor('file'))
	async upload(
		@UploadedFile() file: Express.Multer.File,
		@Req() req: Request,
	) {
		return await this.mediaService.upload(file, req.user['sub']);
	}

	@Get(':id')
	async getUploadMedia(@Param('id') id: string, @Res() res: Response) {
		const { data } = await this.mediaService.getUploadMedia(id);
		res.contentType(data.contentType);
		res.send(Buffer.from(data.buffer));
	}
}
