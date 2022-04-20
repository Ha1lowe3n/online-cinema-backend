import { Request } from 'express';
import { UserModel } from '../user/user.model';

/**
 * express request with user (UserModel)
 *
 * user is not required
 */
export interface IExpressRequest extends Request {
	user?: UserModel;
}
