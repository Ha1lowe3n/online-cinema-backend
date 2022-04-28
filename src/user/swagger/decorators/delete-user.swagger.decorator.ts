import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BadRequestInvalidIdSwagger } from '../../../swagger/400-invalid-id.swagger';
import { ForbiddenSwagger } from '../../../swagger/403-forbidden.swagger';
import { SuccessGetProfileSwagger, UnauthorizedSwagger } from '../responses';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from '../../../utils/error-messages/common-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiDeleteUser = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: '[ADMIN] delete user by id',
			description: 'only admin can delete user',
		}),
		ApiOkResponse({
			description: 'Only admin can delete user',
			type: SuccessGetProfileSwagger,
		}),
		ApiBadRequestResponse({
			description: CommonErrorMessages.ID_INVALID,
			type: BadRequestInvalidIdSwagger,
		}),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger }),
	);
};
