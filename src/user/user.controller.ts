import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { User } from './decoratos/user.decorator';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@AuthRoleGuard()
	async getProfileById(@User('_id') _id: string): Promise<DocumentType<UserModel>> {
		return await this.userService.getProfileById(_id);
	}
}
