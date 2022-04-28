import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RefreshTokenDto, AuthDto } from './dto';
import { IAuthResponse } from './types/auth-types';
import { RegisterSwagger, LoginSwagger, RefreshTokensSwagger } from './swagger/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@RegisterSwagger()
	async register(@Body() dto: AuthDto): Promise<IAuthResponse> {
		return await this.authService.register(dto);
	}

	@Post('login')
	@LoginSwagger()
	@HttpCode(200)
	async login(@Body() dto: AuthDto): Promise<IAuthResponse> {
		return await this.authService.login(dto);
	}

	@Post('login/refresh')
	@RefreshTokensSwagger()
	@HttpCode(200)
	async refreshTokens(@Body() dto: RefreshTokenDto): Promise<IAuthResponse> {
		return await this.authService.refreshTokens(dto);
	}
}
