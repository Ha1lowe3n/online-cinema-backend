import { BadRequestSwagger } from './../../swagger/400-bad-request.swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CommonErrorMessages } from '../../utils/error-messages/common-error-messages';

export class BadRequestDeleteOrGetUserUserSwagger extends BadRequestSwagger {
	@ApiProperty({ example: `${CommonErrorMessages.ID_INVALID}` })
	message: string;
}
