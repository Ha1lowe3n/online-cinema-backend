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

import { BadRequestInvalidIdSwagger } from '../../../swagger/400-invalid-id.swagger';
import { ForbiddenSwagger } from '../../../swagger/403-forbidden.swagger';
import { NotFoundUserSwagger, SuccessGetProfileSwagger, UnauthorizedSwagger } from '../responses';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from '../../../utils/error-messages/common-error-messages';
import { UserErrorMessages } from '../../../utils/error-messages/user-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiGetProfileByUserId = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: '[ADMIN] get user profile by user id',
			description: 'only admin can get user profile by user id',
		}),
		ApiOkResponse({ description: 'get profile by user id', type: SuccessGetProfileSwagger }),
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
			description: UserErrorMessages.USER_NOT_FOUND,
			type: NotFoundUserSwagger,
		}),
	);
};
