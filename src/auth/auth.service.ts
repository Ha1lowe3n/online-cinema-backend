import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../user/user.model';
import { AuthErrorMessages } from '../utils/error-messages';
import { RegistrationDto } from './dto/registration.dto';

@Injectable()
export class AuthService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async register({ email, password }: RegistrationDto): Promise<DocumentType<UserModel>> {
		const findUser = await this.userModel.findOne({ email });
		if (findUser) {
			throw new HttpException(
				AuthErrorMessages.EMAIL_ALREADY_REGISTERED,
				HttpStatus.CONFLICT,
			);
		}

		const passwordHash = await hash(password, 10);
		const newUser = new this.userModel({ email, passwordHash });
		return await newUser.save();
	}
}
