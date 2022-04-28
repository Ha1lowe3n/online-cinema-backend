import { ApiProperty } from '@nestjs/swagger';
import { SuccessGetProfileSwagger } from './200-get-profile.swagger';

export class SuccessUpdateUserRoleSwagger extends SuccessGetProfileSwagger {
	@ApiProperty({ example: 'admin@test.ru' })
	email: string;

	@ApiProperty({ example: true })
	isAdmin: boolean;
}
