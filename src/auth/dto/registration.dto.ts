import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthErrorMessages } from '../../utils/error-messages';

export class RegistrationDto {
	@IsEmail({}, { message: AuthErrorMessages.EMAIL_NOT_VALID })
	email: string;

	@IsString()
	@MinLength(5, {
		message: AuthErrorMessages.PASSWORD_LONG,
	})
	@MaxLength(30, {
		message: AuthErrorMessages.PASSWORD_LONG,
	})
	password: string;
}
