import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';

export class CreateCommentDTO {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	parentId?: string;

	@IsUUID()
	@IsNotEmpty()
	userId: string;

	@IsArray()
	@ValidateNested({ each: true })
	mediaIds: string[];

	@IsUUID()
	@IsNotEmpty()
	postId: string;

	@IsString()
	@IsNotEmpty()
	content: string;
}
