import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { AuthDto } from '../../auth/dto/auth.dto';

export class UpdateUserDto extends PartialType(AuthDto) {
	@ApiProperty({ type: String, description: 'email', example: 'test@test.com', required: false })
	email?: string;

	@ApiProperty({
		type: String,
		description: 'password',
		example: '12345',
		minLength: 5,
		maxLength: 30,
		required: false,
	})
	password?: string;
}
