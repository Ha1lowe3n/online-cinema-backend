import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { IExpressRequest } from 'src/types/common-types';
import { AuthErrorMessages } from '../../utils/error-messages/auth-error-messages';

@Injectable()
export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<IExpressRequest>();
		if (!request.user.isAdmin) {
			throw new HttpException(AuthErrorMessages.FORBIDDEN, HttpStatus.FORBIDDEN);
		}
		return true;
	}
}
