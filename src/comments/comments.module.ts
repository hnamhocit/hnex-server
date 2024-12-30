import { Module } from '@nestjs/common'

import { CommentsController } from './comments.controller'
import { CommentsGateway } from './comments.gateway'
import { CommentsService } from './comments.service'

@Module({
	controllers: [CommentsController],
	providers: [CommentsService, CommentsGateway],
})
export class CommentsModule {}
