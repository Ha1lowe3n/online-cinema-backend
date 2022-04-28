import { ApiProperty } from '@nestjs/swagger';
import { UserErrorMessages } from '../../../utils/error-messages/user-error-messages';
import { NotFoundSwagger } from '../../../swagger/404-not-found.swagger';

export class NotFoundUserSwagger extends NotFoundSwagger {
	@ApiProperty({ example: UserErrorMessages.USER_NOT_FOUND })
	message: string;
}
