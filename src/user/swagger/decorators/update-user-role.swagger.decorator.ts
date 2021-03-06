import { applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
	BadRequestUpdateRoleSwagger,
	SuccessUpdateUserRoleSwagger,
	UnauthorizedSwagger,
} from '../responses';
import { ForbiddenSwagger } from '../../../swagger/403-forbidden.swagger';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from '../../../utils/error-messages/common-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiUpdateUserRole = () => {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: '[ADMIN] update user role by admin',
			description: 'only admin can update user role',
		}),
		ApiOkResponse({ description: 'update role', type: SuccessUpdateUserRoleSwagger }),
		ApiUnauthorizedResponse({
			description: AuthErrorMessages.UNAUTHORIZED,
			type: UnauthorizedSwagger,
		}),
		ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger }),
		ApiBadRequestResponse({
			description: `${CommonErrorMessages.UPDATE_DTO_EMPTY} | ${CommonErrorMessages.ID_INVALID}`,
			type: BadRequestUpdateRoleSwagger,
		}),
	);
};
