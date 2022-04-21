import { BadRequestSwagger } from './../../swagger/400-bad-request.swagger';
import { ApiProperty } from '@nestjs/swagger';
import { UserErrorMessages } from '../../utils/error-messages/user-error-messages';
import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

const { UPDATE_DTO_EMPTY } = UserErrorMessages;
const { EMAIL_NOT_VALID, PASSWORD_LONG } = AuthErrorMessages;

export class BadRequestUpdateSwagger extends BadRequestSwagger {
	@ApiProperty({
		example: `${UPDATE_DTO_EMPTY} | [${UPDATE_DTO_EMPTY}] | [${EMAIL_NOT_VALID}] | [${PASSWORD_LONG}]`,
	})
	message: string | string[];
}
