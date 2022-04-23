import { ApiProperty } from '@nestjs/swagger';

export abstract class ConflictSwagger {
	@ApiProperty({ example: 409 })
	statusCode: number;

	@ApiProperty({ example: 'Conflict' })
	error: string;
}
