import { Module } from '@nestjs/common'

import { PostsController } from './posts.controller'
import { PostsGateway } from './posts.gateway'
import { PostsService } from './posts.service'

@Module({
	controllers: [PostsController],
	providers: [PostsGateway, PostsService],
})
export class PostsModule {}
