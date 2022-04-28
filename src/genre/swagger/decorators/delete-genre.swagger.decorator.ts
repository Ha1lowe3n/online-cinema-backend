import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateGenreDto } from '../../dto/create-genre.dto';
import { BadRequestInvalidIdSwagger } from '../../../swagger/400-invalid-id.swagger';
import { ForbiddenSwagger } from '../../../swagger/403-forbidden.swagger';
import { UnauthorizedSwagger } from '../../../user/swagger/responses';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';
import { SuccessReturnGenreSwagger } from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiDeleteGenre = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: '[ADMIN] delete genre',
			description: 'only admin can delete genre',
		}),
		ApiBody({ type: CreateGenreDto }),
		ApiOkResponse({ description: 'success - delete genre', type: SuccessReturnGenreSwagger }),
		ApiBadRequestResponse({
			description: 'bad request - invalid genre id',
			type: BadRequestInvalidIdSwagger,
		}),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger }),
	);
};
