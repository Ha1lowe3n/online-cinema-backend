import { ApiProperty } from '@nestjs/swagger';

export class ConflictRegisterSwagger {
	@ApiProperty({ example: 409 })
	statusCode: number;

	@ApiProperty({ example: 'Такой email уже зарегистрирован' })
	message: string;
}
