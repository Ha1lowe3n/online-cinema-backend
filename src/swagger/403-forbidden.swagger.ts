import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenSwagger {
	@ApiProperty({ example: 403 })
	statusCode: number;

	@ApiProperty({ example: 'Нет прав доступа' })
	message: string;
}
