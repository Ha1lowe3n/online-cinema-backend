import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActorDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	slug: string;

	@IsString()
	@IsNotEmpty()
	photo: string;
}
