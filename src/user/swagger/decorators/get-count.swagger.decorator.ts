import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ForbiddenSwagger } from '../../../swagger/403-forbidden.swagger';
import { SuccessGetUsersCountSwagger, UnauthorizedSwagger } from '../responses';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiGetCount = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: '[ADMIN] get users count',
			description: 'only admin can get users count',
		}),
		ApiOkResponse({ description: 'get users count', type: SuccessGetUsersCountSwagger }),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger }),
	);
};
