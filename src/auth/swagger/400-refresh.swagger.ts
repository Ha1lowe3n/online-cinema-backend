import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

const { REFRESH_TOKEN_NOT_CORRECT } = AuthErrorMessages;

export class BadRequestRefreshSwagger {
	@ApiProperty({ example: 400 })
	statusCode: number;

	@ApiProperty({
		isArray: true,
		example: `[${REFRESH_TOKEN_NOT_CORRECT}] (if token is not a string) | ${REFRESH_TOKEN_NOT_CORRECT} `,
	})
	message: string[] | string;

	@ApiProperty({ example: 'Bad request' })
	error: string;
}
