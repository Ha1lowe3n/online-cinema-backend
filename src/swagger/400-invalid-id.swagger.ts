import { ApiProperty } from '@nestjs/swagger';
import { CommonErrorMessages } from '../utils/error-messages/common-error-messages';
import { BadRequestSwagger } from './400-bad-request.swagger';

export class BadRequestInvalidIdSwagger extends BadRequestSwagger {
	@ApiProperty({ example: `${CommonErrorMessages.ID_INVALID}` })
	message: string;
}
