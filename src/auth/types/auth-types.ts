import { UserModel } from '../../user/user.model';

export type ReturnUserFieldsType = Pick<UserModel, '_id' | 'email' | 'isAdmin'>;
export type IssueTokensPairType = { refreshToken: string; accessToken: string };
export type JwtPayloadType = { _id: string };
export type RoleType = 'admin' | 'user';

export interface IAuthResponse extends IssueTokensPairType {
	user: ReturnUserFieldsType;
}
