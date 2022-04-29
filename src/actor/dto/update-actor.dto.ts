import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateActorDto } from './create-actor.dto';

export class UpdateActorDto extends PartialType(CreateActorDto) {
	@ApiProperty({ type: String, description: 'name', example: 'John Dep', required: false })
	name?: string;

	@ApiProperty({ type: String, description: 'slug', example: 'John-Dep', required: false })
	slug?: string;

	@ApiProperty({
		type: String,
		description: 'photo',
		example: 'actros/photo.jpg',
		required: false,
	})
	photo?: string;
}
