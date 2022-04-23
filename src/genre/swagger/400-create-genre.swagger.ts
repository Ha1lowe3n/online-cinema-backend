import { ApiProperty } from '@nestjs/swagger';
import { BadRequestSwagger } from '../../swagger/400-bad-request.swagger';

export class BadRequestCreateGenreSwagger extends BadRequestSwagger {
	@ApiProperty({
		example: '[Какая-то ошибка или ошибки валидации]',
		description: 'В массиве может быть несколько ошибок',
	})
	message: string[];
}
