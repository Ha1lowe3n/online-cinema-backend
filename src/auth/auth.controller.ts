import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { AuthErrorMessages } from '../utils/error-messages';
import { UserModel } from '../user/user.model';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/registration.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'user registration', description: 'Some descripton for registration' })
	@ApiCreatedResponse({ description: 'User registration' })
	@ApiConflictResponse({ description: AuthErrorMessages.EMAIL_ALREADY_REGISTERED })
	@ApiBadRequestResponse({
		description: `${AuthErrorMessages.EMAIL_NOT_VALID} | ${AuthErrorMessages.PASSWORD_LONG}`,
	})
	@ApiBody({ type: AuthDto })
	@Post('register')
	async register(@Body() dto: AuthDto): Promise<DocumentType<UserModel>> {
		return await this.authService.register(dto);
	}

	@ApiOperation({ summary: 'user login', description: 'User authorization' })
	@ApiOkResponse({ description: 'User is authorized' })
	@ApiBadRequestResponse({
		description: `${AuthErrorMessages.EMAIL_NOT_VALID} | ${AuthErrorMessages.PASSWORD_LONG}
		| ${AuthErrorMessages.EMAIL_NOT_FOUND} | ${AuthErrorMessages.PASSWORD_FAILED}`,
	})
	@ApiBody({ type: AuthDto })
	@Post('login')
	@HttpCode(200)
	async login(@Body() dto: AuthDto): Promise<DocumentType<UserModel>> {
		return await this.authService.login(dto);
	}
}
