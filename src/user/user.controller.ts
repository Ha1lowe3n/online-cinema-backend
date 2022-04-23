import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Query } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
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
	NotFoundUserSwagger,
	SuccessGetUsersCountSwagger,
	SuccessFindUsersSwagger,
	BadRequestDeleteOrGetUserSwagger,
} from './swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserErrorMessages } from '../utils/error-messages/user-error-messages';
import { ForbiddenSwagger } from '../swagger/403-forbidden.swagger';
import { CommonErrorMessages } from '../utils/error-messages/common-error-messages';

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiBearerAuth()
	@ApiOperation({
		summary: 'get user profile by token',
		description: 'get user profile by token. Inside token take _id',
	})
	@ApiOkResponse({ description: 'get profile by token', type: SuccessGetProfileSwagger })
	@ApiBadRequestResponse({
		description: CommonErrorMessages.ID_INVALID,
		type: BadRequestDeleteOrGetUserSwagger,
	})
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiNotFoundResponse({ description: 'User not found', type: NotFoundUserSwagger })
	@Get('profile')
	@AuthRoleGuard()
	async getProfileByToken(
		@User('_id', IdValidationPipe) _id: string,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.getProfileById(_id);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] get user profile by user id',
		description: 'only admin can get user profile by user id',
	})
	@ApiOkResponse({ description: 'get profile by user id', type: SuccessGetProfileSwagger })
	@ApiBadRequestResponse({
		description: CommonErrorMessages.ID_INVALID,
		type: BadRequestDeleteOrGetUserSwagger,
	})
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger })
	@ApiNotFoundResponse({
		description: UserErrorMessages.USER_NOT_FOUND,
		type: NotFoundUserSwagger,
	})
	@Get('profile/:id')
	@AuthRoleGuard('admin')
	async getProfileByUserId(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.getProfileById(id);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] get users count',
		description: 'only admin can get users count',
	})
	@ApiOkResponse({ description: 'get users count', type: SuccessGetUsersCountSwagger })
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger })
	@Get('count')
	@AuthRoleGuard('admin')
	async getCountUsers(): Promise<any[]> {
		return await this.userService.getCountUsers();
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] find all users or user by email with searchTerm (query param)',
		description: `Only admin can find all users or user by email. 
			Can get empty array if users count = 0 or user email not found`,
	})
	@ApiQuery({ name: 'searchTerm', required: false })
	@ApiOkResponse({
		description: 'find all users or user by email',
		type: SuccessFindUsersSwagger,
		isArray: true,
	})
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger })
	@Get()
	@AuthRoleGuard('admin')
	async findUsers(@Query('searchTerm') searchTerm?: string): Promise<DocumentType<UserModel>[]> {
		return await this.userService.findUsers(searchTerm);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'update user profile', description: 'update user profile' })
	@ApiOkResponse({ description: 'update profile', type: SuccessUpdateUserSwagger })
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiBadRequestResponse({
		description: CommonErrorMessages.UPDATE_DTO_EMPTY,
		type: BadRequestUpdateSwagger,
	})
	@Patch('update')
	@AuthRoleGuard()
	@HttpCode(200)
	async updateUser(
		@User('_id') _id: string,
		@Body() dto: UpdateUserDto,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.updateUser(_id, dto);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] update user role by admin',
		description: 'only admin can update user role',
	})
	@ApiOkResponse({ description: 'update role', type: SuccessUpdateUserRoleSwagger })
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger })
	@ApiBadRequestResponse({
		description: `${CommonErrorMessages.UPDATE_DTO_EMPTY} | ${CommonErrorMessages.ID_INVALID}`,
		type: BadRequestUpdateRoleSwagger,
	})
	@Patch('update/:id')
	@AuthRoleGuard('admin')
	@HttpCode(200)
	async updateUserRole(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserRoleDto,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.updateUserRole(id, dto);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] delete user by id',
		description: 'only admin can delete user',
	})
	@ApiOkResponse({ description: 'Only admin can delete user', type: SuccessGetProfileSwagger })
	@ApiBadRequestResponse({
		description: CommonErrorMessages.ID_INVALID,
		type: BadRequestDeleteOrGetUserSwagger,
	})
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger })
	@Delete(':id')
	@AuthRoleGuard('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string): Promise<DocumentType<UserModel>> {
		return await this.userService.deleteUser(id);
	}
}
