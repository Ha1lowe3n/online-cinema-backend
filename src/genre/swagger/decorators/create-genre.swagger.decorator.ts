import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ForbiddenSwagger } from '../../../swagger/403-forbidden.swagger';
import { UnauthorizedSwagger } from '../../../user/swagger/responses';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';
import {
	BadRequestCreateGenreSwagger,
	ConflictCreateGenreSwagger,
	SuccessReturnGenreSwagger,
} from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiCreateGenre = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: '[ADMIN] create genre',
			description: 'only admin can create genre',
		}),
		ApiCreatedResponse({
			description: 'success - create genre',
			type: SuccessReturnGenreSwagger,
		}),
		ApiBadRequestResponse({
			description: 'bad request - error validate dto',
			type: BadRequestCreateGenreSwagger,
		}),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiConflictResponse({
			description: 'conflict - genre already registered',
			type: ConflictCreateGenreSwagger,
		}),
		ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger }),
	);
};
