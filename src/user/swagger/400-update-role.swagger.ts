import { BadRequestSwagger } from './../../swagger/400-bad-request.swagger';
import { ApiProperty } from '@nestjs/swagger';
import { UserErrorMessages } from '../../utils/error-messages/user-error-messages';

export class BadRequestUpdateRoleSwagger extends BadRequestSwagger {
	@ApiProperty({
		example: `[${UserErrorMessages.IS_ADMIN_NOT_BOOLEAN}]`,
	})
	message: string;
}
