import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { hash } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';

import { UserErrorMessages } from '../utils/error-messages/user-error-messages';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserDataType } from './types/user-types';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async getProfileById(_id: string): Promise<DocumentType<UserModel>> {
		return await this.userModel.findById(_id);
	}

	async updateUser(_id: string, dto: UpdateUserDto): Promise<DocumentType<UserModel>> {
		if (Object.keys(dto).length === 0) {
			throw new BadRequestException(UserErrorMessages.UPDATE_DTO_EMPTY);
		}

		const updateData: UpdateUserDataType = {};
		if (dto.email) {
			updateData.email = dto.email;
		}
		if (dto.password) {
			updateData.passwordHash = await hash(dto.password, 10);
		}

		return await this.userModel.findByIdAndUpdate(_id, updateData, { new: true });
	}

	async updateUserRole(id: string, dto: UpdateUserRoleDto): Promise<DocumentType<UserModel>> {
		if (!dto) {
			throw new BadRequestException(UserErrorMessages.UPDATE_DTO_EMPTY);
		}
		return await this.userModel.findByIdAndUpdate(id, dto, { new: true });
	}
}
