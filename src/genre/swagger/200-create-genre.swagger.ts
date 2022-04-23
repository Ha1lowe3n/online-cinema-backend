import { ApiProperty } from '@nestjs/swagger';

export class SuccessCreateGenreSwagger {
	@ApiProperty({ example: '6263dded652b2193a80e3eee' })
	_id: string;

	@ApiProperty({ example: 'horror' })
	title: string;

	@ApiProperty({ example: 'some-slug' })
	slug: string;

	@ApiProperty({ example: 'some description' })
	description: string;

	@ApiProperty({ example: 'icon path' })
	icon: string;

	@ApiProperty({ example: '2022-04-23T11:07:25.354Z' })
	createdAt: string;

	@ApiProperty({ example: '2022-04-23T11:07:25.354Z' })
	updatedAt: string;

	@ApiProperty({ example: 0 })
	__v: number;
}
