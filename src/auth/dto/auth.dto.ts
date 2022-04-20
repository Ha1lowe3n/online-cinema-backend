import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

export class AuthDto {
	@ApiProperty({ type: String, description: 'email', example: 'test@test.com' })
	@IsEmail({}, { message: AuthErrorMessages.EMAIL_NOT_VALID })
	email: string;

	@ApiProperty({
		type: String,
		description: 'password',
		example: '12345',
		minLength: 5,
		maxLength: 30,
	})
	@IsString()
	@MinLength(5, {
		message: AuthErrorMessages.PASSWORD_LONG,
	})
	@MaxLength(30, {
		message: AuthErrorMessages.PASSWORD_LONG,
	})
	password: string;
}
