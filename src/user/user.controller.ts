import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { AuthErrorMessages } from '../utils/error-messages/auth-error-messages';
import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { User } from './decoratos/user.decorator';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { SuccessGetProfileSwagger, UnauthorizedGetProfileSwagger } from './swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'get user profile', description: 'get user profile' })
	@ApiOkResponse({ description: 'get profile', type: SuccessGetProfileSwagger })
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedGetProfileSwagger,
	})
	@Get('profile')
	@AuthRoleGuard()
	async getProfileById(@User('_id') _id: string): Promise<DocumentType<UserModel>> {
		return await this.userService.getProfileById(_id);
	}
}
