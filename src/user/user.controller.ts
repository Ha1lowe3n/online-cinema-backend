import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { User } from './decoratos/user.decorator';
import { UserModel } from './user.model';
import { UserService } from './user.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import {
	ApiDeleteUser,
	ApiFindUsers,
	ApiGetCount,
	ApiGetProfile,
	ApiGetProfileByUserId,
	ApiUpdateUserProfile,
	ApiUpdateUserRole,
} from './swagger/decorators';

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@ApiGetProfile()
	@AuthRoleGuard()
	async getProfileByToken(
		@User('_id', IdValidationPipe) _id: string,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.getProfileById(_id);
	}

	@Get('profile/:id')
	@ApiGetProfileByUserId()
	@AuthRoleGuard('admin')
	async getProfileByUserId(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.getProfileById(id);
	}

	@Get('count')
	@ApiGetCount()
	@AuthRoleGuard('admin')
	async getCountUsers(): Promise<any[]> {
		return await this.userService.getCountUsers();
	}

	@Get()
	@ApiFindUsers()
	@AuthRoleGuard('admin')
	async findUsers(@Query('searchTerm') searchTerm?: string): Promise<DocumentType<UserModel>[]> {
		return await this.userService.findUsers(searchTerm);
	}

	@Patch('update')
	@ApiUpdateUserProfile()
	@AuthRoleGuard()
	@HttpCode(200)
	async updateUser(
		@User('_id') _id: string,
		@Body() dto: UpdateUserDto,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.updateUser(_id, dto);
	}

	@Patch('update/:id')
	@ApiUpdateUserRole()
	@AuthRoleGuard('admin')
	@HttpCode(200)
	async updateUserRole(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserRoleDto,
	): Promise<DocumentType<UserModel>> {
		return await this.userService.updateUserRole(id, dto);
	}

	@Delete(':id')
	@ApiDeleteUser()
	@AuthRoleGuard('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string): Promise<DocumentType<UserModel>> {
		return await this.userService.deleteUser(id);
	}
}
