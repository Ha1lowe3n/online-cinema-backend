import { BadRequestSwagger } from './../../swagger/400-bad-request.swagger';
import { ApiProperty } from '@nestjs/swagger';
import { UserErrorMessages } from '../../utils/error-messages/user-error-messages';
import { CommonErrorMessages } from '../../utils/error-messages/common-error-messages';

export class BadRequestUpdateRoleSwagger extends BadRequestSwagger {
	@ApiProperty({
		example: `[${UserErrorMessages.IS_ADMIN_NOT_BOOLEAN}] | ${CommonErrorMessages.ID_INVALID}`,
	})
	message: string | string[];
}
