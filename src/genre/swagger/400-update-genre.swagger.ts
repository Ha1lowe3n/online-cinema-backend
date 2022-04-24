import { ApiProperty } from '@nestjs/swagger';
import { CommonErrorMessages } from '../../utils/error-messages/common-error-messages';
import { BadRequestSwagger } from '../../swagger/400-bad-request.swagger';

const { ID_INVALID, UPDATE_DTO_EMPTY } = CommonErrorMessages;

export class BadRequestUpdateGenreSwagger extends BadRequestSwagger {
	@ApiProperty({
		example: `[Какая-то ошибка или ошибки валидации dto] | ${ID_INVALID} | ${UPDATE_DTO_EMPTY}`,
		description: 'В массиве может быть несколько ошибок',
	})
	message: string[] | string;
}
