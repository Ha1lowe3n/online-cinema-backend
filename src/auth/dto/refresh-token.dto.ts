import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AuthErrorMessages } from '../../utils/error-messages';

export class RefreshTokenDto {
	@IsString({ message: AuthErrorMessages.REFRESH_TOKEN_NOT_VALID })
	@ApiProperty({ type: String, description: 'refresh token', example: 'some token' })
	refreshToken: string;
}
