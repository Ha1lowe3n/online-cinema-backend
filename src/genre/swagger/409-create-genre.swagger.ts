import { ApiProperty } from '@nestjs/swagger';
import { ConflictSwagger } from '../../swagger/409-conflict.swagger';

export class ConflictCreateGenreSwagger extends ConflictSwagger {
	@ApiProperty({ example: 'Такой жанр уже создан' })
	message: string;
}
