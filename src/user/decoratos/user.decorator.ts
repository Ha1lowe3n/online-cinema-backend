import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IExpressRequest } from 'src/types/common-types';
import { UserModel } from '../user.model';

export const User = createParamDecorator((data: keyof UserModel, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<IExpressRequest>();
	return data ? request.user[data] : request.user;
});
