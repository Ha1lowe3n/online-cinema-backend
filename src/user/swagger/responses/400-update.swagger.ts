import { BadRequestSwagger } from './../../swagger/400-bad-request.swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CommonErrorMessages } from '../../utils/error-messages/common-error-messages';
import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

const { UPDATE_DTO_EMPTY } = CommonErrorMessages;
const { EMAIL_NOT_VALID, PASSWORD_LONG } = AuthErrorMessages;

export class BadRequestUpdateSwagger extends BadRequestSwagger {
	@ApiProperty({
		example: `${UPDATE_DTO_EMPTY} | [${UPDATE_DTO_EMPTY}] | [${EMAIL_NOT_VALID}] | [${PASSWORD_LONG}]`,
	})
	message: string | string[];
}
