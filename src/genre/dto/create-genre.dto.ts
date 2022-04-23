import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateGenreDto {
	@ApiProperty({ type: String, description: 'title of genre', example: 'horror' })
	@IsString()
	title: string;

	@ApiProperty({
		type: String,
		description: 'slug of genre',
		example: 'some slug',
		required: false,
	})
	@IsString()
	@IsOptional()
	slug?: string;

	@ApiProperty({
		type: String,
		description: 'description of genre',
		example: 'genre is horror',
		required: false,
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		type: String,
		description: 'icon of genre',
		example: 'material ui icon',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;
}
