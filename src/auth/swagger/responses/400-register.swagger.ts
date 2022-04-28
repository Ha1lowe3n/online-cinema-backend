import { ApiProperty } from '@nestjs/swagger';
import { BadRequestSwagger } from '../../../swagger/400-bad-request.swagger';
import { AuthErrorMessages } from '../../../utils/error-messages/auth-error-messages';

const { EMAIL_NOT_VALID, PASSWORD_LONG } = AuthErrorMessages;

export class BadRequestRegisterSwagger extends BadRequestSwagger {
	@ApiProperty({
		isArray: true,
		example: `[${EMAIL_NOT_VALID}] | [${PASSWORD_LONG}]`,
	})
	message: string[];
}
