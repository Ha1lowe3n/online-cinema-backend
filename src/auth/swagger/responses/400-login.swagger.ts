import { ApiProperty } from '@nestjs/swagger';

import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';
import { BadRequestSwagger } from '../../swagger/400-bad-request.swagger';

const { EMAIL_NOT_VALID, PASSWORD_LONG, PASSWORD_FAILED } = AuthErrorMessages;

export class BadRequestLoginSwagger extends BadRequestSwagger {
	@ApiProperty({
		isArray: true,
		example: `[${EMAIL_NOT_VALID}] | [${PASSWORD_LONG}] | ${PASSWORD_FAILED}`,
	})
	message: string[] | string;
}
