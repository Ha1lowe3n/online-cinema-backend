import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ForbiddenSwagger } from 'src/swagger/403-forbidden.swagger';
import { SuccessGetUsersCountSwagger, UnauthorizedSwagger } from 'src/user/swagger/responses';
import { AuthErrorMessages } from 'src/utils/error-messages/auth-error-messages';

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
