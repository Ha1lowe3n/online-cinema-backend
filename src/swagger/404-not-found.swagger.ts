import { ApiProperty } from '@nestjs/swagger';

export abstract class NotFoundSwagger {
	@ApiProperty({ example: 404 })
	statusCode: number;

	@ApiProperty({ example: 'Not Found' })
	error: string;
}
