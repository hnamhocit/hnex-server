import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReactionDTO {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	postId: string;

	@IsString()
	@IsNotEmpty()
	@IsEnum($Enums.ReactionType)
	type: $Enums.ReactionType;
}
