import { applyDecorators } from '@nestjs/common';

import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOperation,
} from '@nestjs/swagger';

import { AuthErrorMessages } from 'src/utils/error-messages/auth-error-messages';
import {
	AuthResponseSwagger,
	ConflictRegisterSwagger,
	BadRequestRegisterSwagger,
} from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const RegisterSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: 'user registration',
			description: 'Some descripton for registration',
		}),
		ApiCreatedResponse({ description: 'User registration', type: AuthResponseSwagger }),
		ApiConflictResponse({
			description: AuthErrorMessages.EMAIL_ALREADY_REGISTERED,
			type: ConflictRegisterSwagger,
		}),
		ApiBadRequestResponse({
			description: `${AuthErrorMessages.PASSWORD_LONG} | ${AuthErrorMessages.EMAIL_NOT_VALID}`,
			type: BadRequestRegisterSwagger,
		}),
	);
};
