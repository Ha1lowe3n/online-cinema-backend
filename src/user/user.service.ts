import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserErrorMessages } from 'src/utils/error-messages/user-error-messages';

import { UserModel } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async getProfileById(_id: string): Promise<DocumentType<UserModel>> {
		const user = await this.userModel.findById(_id);
		if (!user) throw new NotFoundException(UserErrorMessages);
		return user;
	}
}
