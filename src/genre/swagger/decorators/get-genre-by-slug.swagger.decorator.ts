import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UnauthorizedSwagger } from '../../../user/swagger/responses';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';
import { GenreErrorMessages } from '../../../utils/error-messages/genre-error-messages';
import { NotFoundGenreSwagger, SuccessReturnGenreSwagger } from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiGetGenreBySlug = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'get genre by slug' }),
		ApiOkResponse({ description: 'get genre by slug', type: SuccessReturnGenreSwagger }),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiNotFoundResponse({
			description: GenreErrorMessages.GENRE_NOT_FOUND,
			type: NotFoundGenreSwagger,
		}),
	);
};
