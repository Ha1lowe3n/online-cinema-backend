import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessages } from '../../utils/error-messages';

const { EMAIL_NOT_VALID, PASSWORD_LONG } = AuthErrorMessages;

export class BadRequestRegisterSwagger {
	@ApiProperty({ example: 400 })
	statusCode: number;

	@ApiProperty({
		isArray: true,
		example: `[${EMAIL_NOT_VALID}] | [${PASSWORD_LONG}]`,
	})
	message: string[];

	@ApiProperty({ example: 'Bad request' })
	error: string;
}
