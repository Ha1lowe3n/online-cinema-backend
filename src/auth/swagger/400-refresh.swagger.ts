import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';
import { BadRequestSwagger } from '../../swagger/400-bad-request.swagger';

const { REFRESH_TOKEN_NOT_CORRECT } = AuthErrorMessages;

export class BadRequestRefreshSwagger extends BadRequestSwagger {
	@ApiProperty({
		isArray: true,
		example: `[${REFRESH_TOKEN_NOT_CORRECT}] (if token is not a string) | ${REFRESH_TOKEN_NOT_CORRECT} `,
	})
	message: string[] | string;
}
