import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateGenreDto } from 'src/genre/dto/create-genre.dto';
import { ForbiddenSwagger } from 'src/swagger/403-forbidden.swagger';
import { UnauthorizedSwagger } from 'src/user/swagger/responses';
import { AuthErrorMessages } from 'src/utils/error-messages/auth-error-messages';
import { GenreErrorMessages } from 'src/utils/error-messages/genre-error-messages';
import {
	BadRequestUpdateGenreSwagger,
	NotFoundGenreSwagger,
	SuccessReturnGenreSwagger,
} from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiUpdateGenre = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: '[ADMIN] update genre',
			description: 'only admin can update genre',
		}),
		ApiBody({ type: CreateGenreDto }),
		ApiOkResponse({ description: 'success - create genre', type: SuccessReturnGenreSwagger }),
		ApiBadRequestResponse({
			description: 'bad request - error validate dto or genre id',
			type: BadRequestUpdateGenreSwagger,
		}),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger }),
		ApiNotFoundResponse({
			description: GenreErrorMessages.GENRE_NOT_FOUND,
			type: NotFoundGenreSwagger,
		}),
	);
};
