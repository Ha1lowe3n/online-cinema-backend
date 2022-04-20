import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthErrorMessages } from '../utils/error-messages';
import { AuthService } from './auth.service';
import { RefreshTokenDto, AuthDto } from './dto';
import { IAuthResponse } from './types/auth-types';
import {
	UnauthorizedRefreshSwagger,
	BadRequestRefreshSwagger,
	BadRequestLoginSwagger,
	NotFoundLoginSwagger,
	AuthResponseSwagger,
	BadRequestRegisterSwagger,
} from './swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'user registration', description: 'Some descripton for registration' })
	@ApiCreatedResponse({ description: 'User registration', type: AuthResponseSwagger })
	@ApiConflictResponse({ description: AuthErrorMessages.EMAIL_ALREADY_REGISTERED })
	@ApiBadRequestResponse({
		description: `${AuthErrorMessages.PASSWORD_LONG} | ${AuthErrorMessages.EMAIL_NOT_VALID}`,
		type: BadRequestRegisterSwagger,
	})
	@ApiBody({ type: AuthDto })
	@Post('register')
	async register(@Body() dto: AuthDto): Promise<IAuthResponse> {
		return await this.authService.register(dto);
	}

	@ApiOperation({ summary: 'user login', description: 'User authorization' })
	@ApiOkResponse({ description: 'User is authorized', type: AuthResponseSwagger })
	@ApiBadRequestResponse({
		description: `${AuthErrorMessages.EMAIL_NOT_VALID} | ${AuthErrorMessages.PASSWORD_LONG}
		| ${AuthErrorMessages.PASSWORD_FAILED}`,
		type: BadRequestLoginSwagger,
	})
	@ApiNotFoundResponse({
		description: `${AuthErrorMessages.EMAIL_NOT_FOUND}`,
		type: NotFoundLoginSwagger,
	})
	@ApiBody({ type: AuthDto })
	@Post('login')
	@HttpCode(200)
	async login(@Body() dto: AuthDto): Promise<IAuthResponse> {
		return await this.authService.login(dto);
	}

	@ApiOperation({
		summary: 'refresh tokens',
		description: 'refresh tokens (access and refresh) for user',
	})
	@ApiOkResponse({ description: 'Tokens were updated', type: AuthResponseSwagger })
	@ApiBadRequestResponse({
		description: `${AuthErrorMessages.REFRESH_TOKEN_NOT_CORRECT}`,
		type: BadRequestRefreshSwagger,
	})
	@ApiUnauthorizedResponse({
		description: `${AuthErrorMessages.UNAUTHORIZED}`,
		type: UnauthorizedRefreshSwagger,
	})
	@ApiBody({ type: RefreshTokenDto })
	@Post('login/refresh')
	@HttpCode(200)
	async refreshTokens(@Body() dto: RefreshTokenDto): Promise<IAuthResponse> {
		return await this.authService.refreshTokens(dto);
	}
}
