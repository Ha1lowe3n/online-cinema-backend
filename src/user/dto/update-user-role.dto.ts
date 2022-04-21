import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { UserErrorMessages } from '../../utils/error-messages/user-error-messages';

export class UpdateUserRoleDto {
	@ApiProperty({ type: Boolean, description: 'user role', example: true })
	@IsBoolean({ message: UserErrorMessages.IS_ADMIN_NOT_BOOLEAN })
	isAdmin: boolean;
}
