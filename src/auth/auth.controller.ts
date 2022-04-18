import { Body, Controller, Post } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { UserModel } from '../user/user.model';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: RegistrationDto): Promise<DocumentType<UserModel>> {
		return await this.authService.register(dto);
	}
}
