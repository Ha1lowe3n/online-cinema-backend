import { ApiProperty } from '@nestjs/swagger';

export abstract class BadRequestSwagger {
	@ApiProperty({ example: 400 })
	statusCode: number;

	@ApiProperty({ example: 'Bad request' })
	error: string;
}
