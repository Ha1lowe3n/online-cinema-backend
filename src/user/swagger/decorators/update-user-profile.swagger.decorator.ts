import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
	BadRequestUpdateSwagger,
	SuccessUpdateUserSwagger,
	UnauthorizedSwagger,
} from 'src/user/swagger/responses';
import { AuthErrorMessages } from 'src/utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from 'src/utils/error-messages/common-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiUpdateUserProfile = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({ summary: 'update user profile', description: 'update user profile' }),
		ApiOkResponse({ description: 'update profile', type: SuccessUpdateUserSwagger }),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiBadRequestResponse({
			description: CommonErrorMessages.UPDATE_DTO_EMPTY,
			type: BadRequestUpdateSwagger,
		}),
	);
};
