import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

import { $Enums } from '@prisma/client';

export class CreateReactionDTO {
	@IsOptional()
	@IsUUID()
	postId?: string;

	@IsOptional()
	@IsUUID()
	commentId?: string;

	@IsString()
	@IsNotEmpty()
	@IsEnum($Enums.ReactionType)
	type: $Enums.ReactionType;
}
