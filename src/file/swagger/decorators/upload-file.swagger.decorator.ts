import { applyDecorators } from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UploadFileSwagger = () => {
	return applyDecorators(
		ApiOperation({
			summary: '[ADMIN] upload file',
			description: 'only admin can upload file',
		}),
		ApiBearerAuth(),
		ApiQuery({ name: 'folder', required: false }),
		ApiConsumes('multipart/form-data'),
		ApiBody({
			description: 'Upload file',
			schema: {
				type: 'object',
				properties: {
					file: { type: 'string', format: 'binary' },
				},
			},
		}),
	);
};
