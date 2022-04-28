import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BadRequestInvalidIdSwagger } from '../../../swagger/400-invalid-id.swagger';
import { NotFoundUserSwagger, SuccessGetProfileSwagger, UnauthorizedSwagger } from '../responses';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from '../../../utils/error-messages/common-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiGetProfile = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: 'get user profile by token',
			description: 'get user profile by token. Inside token take _id',
		}),
		ApiOkResponse({ description: 'get profile by token', type: SuccessGetProfileSwagger }),
		ApiBadRequestResponse({
			description: CommonErrorMessages.ID_INVALID,
			type: BadRequestInvalidIdSwagger,
		}),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiNotFoundResponse({ description: 'User not found', type: NotFoundUserSwagger }),
	);
};
