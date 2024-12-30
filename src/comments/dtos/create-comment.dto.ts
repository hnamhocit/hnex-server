import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator'

export class CreateCommentDTO {
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
