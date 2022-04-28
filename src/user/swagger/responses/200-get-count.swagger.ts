import { ApiProperty } from '@nestjs/swagger';

export class SuccessGetUsersCountSwagger {
	@ApiProperty({ example: 5 })
	total: number;
}
