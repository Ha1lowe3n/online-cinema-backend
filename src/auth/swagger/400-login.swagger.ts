import { ApiProperty } from '@nestjs/swagger';

import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

const { EMAIL_NOT_VALID, PASSWORD_LONG, PASSWORD_FAILED } = AuthErrorMessages;

export class BadRequestLoginSwagger {
	@ApiProperty({ example: 400 })
	statusCode: number;

	@ApiProperty({
		isArray: true,
		example: `[${EMAIL_NOT_VALID}] | [${PASSWORD_LONG}] | ${PASSWORD_FAILED}`,
	})
	message: string[] | string;

	@ApiProperty({ example: 'Bad request' })
	error: string;
}
