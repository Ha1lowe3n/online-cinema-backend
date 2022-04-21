import { Body, Controller, Get, HttpCode, Param, Patch } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { AuthErrorMessages } from '../utils/error-messages/auth-error-messages';
import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { User } from './decoratos/user.decorator';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import {
	SuccessGetProfileSwagger,
	UnauthorizedSwagger,
	BadRequestUpdateSwagger,
	BadRequestUpdateRoleSwagger,
	SuccessUpdateUserSwagger,
	SuccessUpdateUserRoleSwagger,
} from './swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserErrorMessages } from '../utils/error-messages/user-error-messages';

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'get user profile', description: 'get user profile' })
	@ApiOkResponse({ description: 'get profile', type: SuccessGetProfileSwagger })
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiBearerAuth()
	@Get('profile')
	@AuthRoleGuard()
	async getProfileById(@User('_id') _id: string): Promise<DocumentType<UserModel>> {
		return await this.userService.getProfileById(_id);
	}

	@ApiOperation({ summary: 'update user profile', description: 'update user profile' })
	@ApiOkResponse({ description: 'update profile', type: SuccessUpdateUserSwagger })
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiBadRequestResponse({
		description: UserErrorMessages.UPDATE_DTO_EMPTY,
		type: BadRequestUpdateSwagger,
	})
	@ApiBearerAuth()
	@Patch('update')
	@AuthRoleGuard()
	@HttpCode(200)
	async updateUser(
		@User('_id') _id: string,
		@Body() dto: UpdateUserDto,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.updateUser(_id, dto);
	}

	@ApiOperation({ summary: 'update user role', description: 'update user role' })
	@ApiOkResponse({ description: 'update role', type: SuccessUpdateUserRoleSwagger })
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiBadRequestResponse({
		description: UserErrorMessages.UPDATE_DTO_EMPTY,
		type: BadRequestUpdateRoleSwagger,
	})
	@ApiBearerAuth()
	@Patch('update/:id')
	@AuthRoleGuard('admin')
	@HttpCode(200)
	async updateUserRole(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserRoleDto,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.updateUserRole(id, dto);
	}
}
