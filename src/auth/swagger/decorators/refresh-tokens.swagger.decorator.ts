import { applyDecorators } from '@nestjs/common';

import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthErrorMessages } from 'src/utils/error-messages/auth-error-messages';
import {
	AuthResponseSwagger,
	BadRequestRefreshSwagger,
	UnauthorizedRefreshSwagger,
} from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const RefreshTokensSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: 'refresh tokens',
			description: 'refresh tokens (access and refresh) for user',
		}),
		ApiOkResponse({ description: 'Tokens were updated', type: AuthResponseSwagger }),
		ApiBadRequestResponse({
			description: `${AuthErrorMessages.REFRESH_TOKEN_NOT_CORRECT}`,
			type: BadRequestRefreshSwagger,
		}),
		ApiUnauthorizedResponse({
			description: `${AuthErrorMessages.UNAUTHORIZED}`,
			type: UnauthorizedRefreshSwagger,
		}),
	);
};
