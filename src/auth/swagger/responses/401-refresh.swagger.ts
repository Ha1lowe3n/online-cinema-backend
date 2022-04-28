import { ApiProperty } from '@nestjs/swagger';

import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

const { REFRESH_TOKEN_NOT_VALID } = AuthErrorMessages;

export class UnauthorizedRefreshSwagger {
	@ApiProperty({ example: 401 })
	statusCode: number;

	@ApiProperty({ example: `${REFRESH_TOKEN_NOT_VALID}` })
	message: string;

	@ApiProperty({ example: 'UNAUTHORIZED' })
	error: string;
}
