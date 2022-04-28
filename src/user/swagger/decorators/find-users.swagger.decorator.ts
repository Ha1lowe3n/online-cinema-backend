import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ForbiddenSwagger } from '../../../swagger/403-forbidden.swagger';
import { SuccessFindUsersSwagger, UnauthorizedSwagger } from '../responses';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiFindUsers = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: '[ADMIN] find all users or user by email with searchTerm (query param)',
			description: `Only admin can find all users or user by email. 
			Can get empty array if users count = 0 or user email not found`,
		}),
		ApiQuery({ name: 'searchTerm', required: false }),
		ApiOkResponse({
			description: 'find all users or user by email',
			type: SuccessFindUsersSwagger,
			isArray: true,
		}),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger }),
	);
};
