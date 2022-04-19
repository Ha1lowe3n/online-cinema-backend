import { UserModel } from '../../user/user.model';

export type ReturnUserFieldsType = Pick<UserModel, '_id' | 'email' | 'isAdmin'>;
export type IssueTokensPairType = { refreshToken: string; accessToken: string };
export type AuthResponseType = IssueTokensPairType & {
	user: ReturnUserFieldsType;
};
