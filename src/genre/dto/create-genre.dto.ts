import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GenreErrorMessages } from '../../utils/error-messages/genre-error-messages';

const {
	GENRE_TITLE_SHOULD_BE_STRING,
	GENRE_TITLE_CANT_BE_EMPTY,
	GENRE_SLUG_SHOULD_BE_STRING,
	GENRE_DESCRIPTION_SHOULD_BE_STRING,
	GENRE_ICON_SHOULD_BE_STRING,
} = GenreErrorMessages;
export class CreateGenreDto {
	@ApiProperty({ type: String, description: 'title of genre', example: 'horror' })
	@IsString({ message: GENRE_TITLE_SHOULD_BE_STRING })
	@IsNotEmpty({ message: GENRE_TITLE_CANT_BE_EMPTY })
	title: string;

	@ApiProperty({
		type: String,
		description: 'slug of genre',
		example: 'some slug',
		required: false,
	})
	@IsString({ message: GENRE_SLUG_SHOULD_BE_STRING })
	@IsOptional()
	slug?: string;

	@ApiProperty({
		type: String,
		description: 'description of genre',
		example: 'genre is horror',
		required: false,
	})
	@IsString({ message: GENRE_DESCRIPTION_SHOULD_BE_STRING })
	@IsOptional()
	description?: string;

	@ApiProperty({
		type: String,
		description: 'icon of genre',
		example: 'material ui icon',
		required: false,
	})
	@IsString({ message: GENRE_ICON_SHOULD_BE_STRING })
	@IsOptional()
	icon?: string;
}
