import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { CommentsModule } from './comments/comments.module'
import { MailsModule } from './mails/mails.module'
import { MediaModule } from './media/media.module'
import { NotificationsModule } from './notifications/notifications.module'
import { PostsModule } from './posts/posts.module'
import { PrismaModule } from './prisma/prisma.module'
import { ReactionsModule } from './reactions/reactions.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		UsersModule,
		AuthModule,
		MediaModule,
		ReactionsModule,
		PostsModule,
		CommentsModule,
		MailsModule,
		NotificationsModule,
	],
})
export class AppModule {}
