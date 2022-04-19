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

import { AuthErrorMessages } from '../utils/error-messages';
import { AuthService } from './auth.service';
import { RefreshTokenDto, AuthDto } from './dto';
import { AuthResponseType } from './types/auth-types';

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
	async register(@Body() dto: AuthDto): Promise<AuthResponseType> {
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
	async login(@Body() dto: AuthDto): Promise<AuthResponseType> {
		return await this.authService.login(dto);
	}

	@ApiOperation({
		summary: 'refresh tokens',
		description: 'refresh tokens (access and refresh) for user',
	})
	@ApiOkResponse({ description: 'Tokens were updated' })
	@ApiBadRequestResponse({
		description: `${AuthErrorMessages.EMAIL_NOT_VALID} | ${AuthErrorMessages.PASSWORD_LONG}
		| ${AuthErrorMessages.EMAIL_NOT_FOUND} | ${AuthErrorMessages.PASSWORD_FAILED}`,
	})
	@ApiBody({ type: RefreshTokenDto })
	@Post('login/refresh')
	@HttpCode(200)
	async refreshTokens(@Body() dto: RefreshTokenDto): Promise<AuthResponseType> {
		return await this.authService.refreshTokens(dto);
	}
}
