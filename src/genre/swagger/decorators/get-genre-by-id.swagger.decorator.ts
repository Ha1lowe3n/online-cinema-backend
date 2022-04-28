import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BadRequestInvalidIdSwagger } from 'src/swagger/400-invalid-id.swagger';
import { ForbiddenSwagger } from 'src/swagger/403-forbidden.swagger';
import { UnauthorizedSwagger } from 'src/user/swagger';
import { AuthErrorMessages } from 'src/utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from 'src/utils/error-messages/common-error-messages';
import { GenreErrorMessages } from 'src/utils/error-messages/genre-error-messages';
import { NotFoundGenreSwagger, SuccessReturnGenreSwagger } from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiGetGenreById = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: '[ADMIN] get genre by genre id' }),
		ApiOkResponse({ description: 'get genre by genre id', type: SuccessReturnGenreSwagger }),
		ApiBadRequestResponse({
			description: CommonErrorMessages.ID_INVALID,
			type: BadRequestInvalidIdSwagger,
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
