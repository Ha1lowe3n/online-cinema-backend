import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

export class NotFoundLoginSwagger {
	@ApiProperty({ example: 400 })
	statusCode: number;

	@ApiProperty({ example: `${AuthErrorMessages.EMAIL_NOT_FOUND}` })
	message: string;

	@ApiProperty({ example: 'Bad request' })
	error: string;
}
