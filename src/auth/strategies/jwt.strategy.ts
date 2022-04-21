import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserModel } from '../../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET_KEY'),
		});
	}

	async validate({ _id }: Pick<UserModel, '_id'>): Promise<DocumentType<UserModel>> {
		try {
			return await this.userModel.findById(_id);
		} catch (error) {
			throw new UnauthorizedException();
		}
	}
}
