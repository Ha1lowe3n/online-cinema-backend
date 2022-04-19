import { Body, Controller, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { AuthErrorMessages } from '../utils/error-messages';
import { UserModel } from '../user/user.model';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiOperation({ summary: 'user registration', description: 'Some descripton for registration' })
	@ApiCreatedResponse({ description: 'User registration' })
	@ApiConflictResponse({ description: AuthErrorMessages.EMAIL_ALREADY_REGISTERED })
	@ApiBadRequestResponse({
		description: `${AuthErrorMessages.EMAIL_NOT_VALID} | ${AuthErrorMessages.PASSWORD_LONG}`,
	})
	@ApiBody({ type: RegistrationDto })
	async register(@Body() dto: RegistrationDto): Promise<DocumentType<UserModel>> {
		return await this.authService.register(dto);
	}
}
