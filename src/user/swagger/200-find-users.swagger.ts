import { ApiProperty } from '@nestjs/swagger';

export class SuccessFindUsersSwagger {
	@ApiProperty({ example: '625e8e3b802fdd2df1ee2cdf' })
	_id: string;

	@ApiProperty({ example: 'test@test.ru' })
	email: string;

	@ApiProperty({
		example: '$2b$10$yP.cRlfvaxMBDnGDMcdkjhkjhko1OP.7gH9uKbOkjklsK/Lz2BUPGHuPu08M.whjhkh',
	})
	passwordHash: string;

	@ApiProperty({ example: false })
	isAdmin: boolean;

	@ApiProperty({ example: ['avatar', 'averages'] })
	favoritesMovies: string[];

	@ApiProperty({ example: '2022-04-19T10:26:03.166Z' })
	createdAt: Date;
}
