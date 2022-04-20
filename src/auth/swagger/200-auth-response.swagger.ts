import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IAuthResponse, ReturnUserFieldsType } from '../types/auth-types';

class User implements ReturnUserFieldsType {
	@ApiProperty({ example: '625e8e3b802fdd2df1ee2cdf' })
	_id: Types.ObjectId;

	@ApiProperty({ example: 'aa@aa.com' })
	email: string;

	@ApiProperty({ example: true, default: false })
	isAdmin: boolean;
}

export class AuthResponseSwagger implements IAuthResponse {
	@ApiProperty()
	user: User;

	@ApiProperty({
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVlOGUzYfgjgwMmZkZDJkZjFlZTJjZGYiLCJpYXQiOjE2NTAzNjM5NjgsImV4cCI6MTY1MDM2NzU2OH0.1H3eG-CYkTEgZUp3zIvHDSPZQ5a_nAItkVhxAzn8dZ8',
	})
	refreshToken: string;

	@ApiProperty({
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVlOGUzYfgjgwMmZkZDJkZjFlZTJjZGYiLCJpYXQiOjE2NTAzNjM5NjgsImV4cCI6MTY1MDM2NzU2OH0.1H3eG-CYkTEgZUp3zIvHDSPZQ5a_nAItkVhxAzn8dZ8',
	})
	accessToken: string;
}
