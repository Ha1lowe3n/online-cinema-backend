import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFileDto {
	@IsString()
	@IsNotEmpty()
	@Type(() => String)
	fileTitleForDelete: string;

	@IsString()
	@IsNotEmpty()
	@Type(() => String)
	folder: string;
}
