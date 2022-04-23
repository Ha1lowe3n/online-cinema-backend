import { GenreErrorMessages } from '../../utils/error-messages/genre-error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { NotFoundSwagger } from '../../swagger/404-not-found.swagger';

export class NotFoundGenreBySlugSwagger extends NotFoundSwagger {
	@ApiProperty({ example: GenreErrorMessages.GENRE_NOT_FOUND })
	message: string;
}
