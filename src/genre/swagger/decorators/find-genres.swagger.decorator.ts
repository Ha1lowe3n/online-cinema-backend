import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SuccessReturnGenreSwagger } from '../responses';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiFindGenres = () => {
	return applyDecorators(
		ApiOperation({ summary: 'get all genres or genre by searchTerm' }),
		ApiQuery({ name: 'searchTerm', required: false }),
		ApiOkResponse({
			description: 'get genre by slug',
			type: SuccessReturnGenreSwagger,
			isArray: true,
		}),
	);
};
