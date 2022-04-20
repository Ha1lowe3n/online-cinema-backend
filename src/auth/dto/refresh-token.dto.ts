import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

export class RefreshTokenDto {
	@IsString({ message: AuthErrorMessages.REFRESH_TOKEN_NOT_CORRECT })
	@ApiProperty({
		type: String,
		description: 'refresh token',
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVlOGUzYfgjgwMmZkZDJkZjFlZTJjZGYiLCJpYXQiOjE2NTAzNjM5NjgsImV4cCI6MTY1MDM2NzU2OH0.1H3eG-CYkTEgZUp3zIvHDSPZQ5a_nAItkVhxAzn8dZ8',
	})
	refreshToken: string;
}
