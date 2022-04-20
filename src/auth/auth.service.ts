import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError } from 'jsonwebtoken';

import { UserModel } from '../user/user.model';
import { AuthErrorMessages } from '../utils/error-messages/auth-error-messages';
import { AuthDto, RefreshTokenDto } from './dto';
import {
	IAuthResponse,
	IssueTokensPairType,
	JwtPayloadType,
	ReturnUserFieldsType,
} from './types/auth-types';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async register({ email, password }: AuthDto): Promise<IAuthResponse> {
		const findUser = await this.userModel.findOne({ email });
		if (findUser) {
			throw new HttpException(
				AuthErrorMessages.EMAIL_ALREADY_REGISTERED,
				HttpStatus.CONFLICT,
			);
		}

		const passwordHash = await hash(password, 10);
		const newUser = new this.userModel({ email, passwordHash });
		await newUser.save();

		return await this.authResponse(newUser);
	}

	async login({ email, password }: AuthDto): Promise<IAuthResponse> {
		const findUserByEmail = await this.userModel.findOne({ email });
		if (!findUserByEmail) {
			throw new HttpException(AuthErrorMessages.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const validatePassword = await compare(password, findUserByEmail.passwordHash);
		if (!validatePassword) {
			throw new HttpException(AuthErrorMessages.PASSWORD_FAILED, HttpStatus.BAD_REQUEST);
		}

		return await this.authResponse(findUserByEmail);
	}

	async refreshTokens({ refreshToken }: RefreshTokenDto): Promise<IAuthResponse> {
		let payload;
		try {
			payload = (await this.jwtService.verifyAsync(refreshToken)) as JwtPayloadType;
		} catch (err) {
			if (err instanceof JsonWebTokenError) {
				throw new HttpException(
					AuthErrorMessages.REFRESH_TOKEN_NOT_CORRECT,
					HttpStatus.BAD_REQUEST,
				);
			}
		}

		if (!payload) {
			throw new HttpException(
				AuthErrorMessages.REFRESH_TOKEN_NOT_VALID,
				HttpStatus.UNAUTHORIZED,
			);
		}

		const user = await this.userModel.findById(payload._id);

		return await this.authResponse(user);
	}

	// ---------- utils methods ----------
	async issueTokensPair(userId: string): Promise<IssueTokensPairType> {
		const payload: JwtPayloadType = { _id: userId };

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

	async authResponse(user: UserModel): Promise<IAuthResponse> {
		const tokens = await this.issueTokensPair(user._id.toString());
		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}
}
