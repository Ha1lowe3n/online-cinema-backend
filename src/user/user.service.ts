import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
		try {
			const user = await this.userModel.findById(_id);
			if (!user) {
				throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
			}
			return user;
		} catch (error) {
			throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
		}
	}

	async getCountUsers(): Promise<any[]> {
		const arrayWithTotal = await this.userModel.aggregate([{ $count: 'total' }]);
		return arrayWithTotal[0];
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

	async findUsers(searchTerm?: string): Promise<DocumentType<UserModel>[]> {
		let options = {};

		// если $caseSensitive: false не работает, использовать new RegExp(searchTerm, 'i')
		if (searchTerm) {
			options = {
				$or: [{ email: new RegExp(searchTerm, 'i') }],
			};
		}
		return await this.userModel
			.find(options)
			.select('-passwordHash -updatedAt -__v')
			.sort({ createdAt: 1 });
	}

	async deleteUser(id: string): Promise<DocumentType<UserModel>> {
		const deletedUser = await this.userModel.findByIdAndDelete(id);
		if (!deletedUser) throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
		return deletedUser;
	}
}
