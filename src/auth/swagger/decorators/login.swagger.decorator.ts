import { applyDecorators } from '@nestjs/common';

import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
} from '@nestjs/swagger';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';
import { AuthResponseSwagger, BadRequestLoginSwagger, NotFoundLoginSwagger } from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiLogin = () => {
	return applyDecorators(
		ApiOperation({ summary: 'user login', description: 'User authorization' }),
		ApiOkResponse({ description: 'User is authorized', type: AuthResponseSwagger }),
		ApiBadRequestResponse({
			description: `${AuthErrorMessages.EMAIL_NOT_VALID} | ${AuthErrorMessages.PASSWORD_LONG}
		| ${AuthErrorMessages.PASSWORD_FAILED}`,
			type: BadRequestLoginSwagger,
		}),
		ApiNotFoundResponse({
			description: `${AuthErrorMessages.EMAIL_NOT_FOUND}`,
			type: NotFoundLoginSwagger,
		}),
	);
};
