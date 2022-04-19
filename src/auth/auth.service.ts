import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { JwtService } from '@nestjs/jwt';

import { UserModel } from '../user/user.model';
import { AuthErrorMessages } from '../utils/error-messages';
import { AuthDto } from './dto/registration.dto';
import { AuthResponseType, IssueTokensPairType, ReturnUserFieldsType } from './types/auth-types';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async register({ email, password }: AuthDto): Promise<AuthResponseType> {
		const findUser = await this.userModel.findOne({ email });
		if (findUser) {
			throw new HttpException(
				AuthErrorMessages.EMAIL_ALREADY_REGISTERED,
				HttpStatus.CONFLICT,
			);
		}

		const passwordHash = await hash(password, 10);
		const newUser = new this.userModel({ email, passwordHash });
		const tokens = await this.issueTokensPair(newUser._id.toString());

		await newUser.save();
		return {
			user: this.returnUserFields(newUser),
			...tokens,
		};
	}

	async login({ email, password }: AuthDto): Promise<AuthResponseType> {
		const findUserByEmail = await this.userModel.findOne({ email });
		if (!findUserByEmail) {
			throw new HttpException(AuthErrorMessages.EMAIL_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}

		const validatePassword = await compare(password, findUserByEmail.passwordHash);
		if (!validatePassword) {
			throw new HttpException(AuthErrorMessages.PASSWORD_FAILED, HttpStatus.BAD_REQUEST);
		}

		const tokens = await this.issueTokensPair(findUserByEmail._id.toString());
		return {
			user: this.returnUserFields(findUserByEmail),
			...tokens,
		};
	}

	async issueTokensPair(userId: string): Promise<IssueTokensPairType> {
		const payload = { _id: userId };

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: '15d',
		});
		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: '1h',
		});

		return { refreshToken, accessToken };
	}

	returnUserFields({ _id, email, isAdmin }: UserModel): ReturnUserFieldsType {
		return { _id, email, isAdmin };
	}
}
