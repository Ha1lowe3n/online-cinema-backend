import { AuthDto } from '../../src/auth/dto/auth.dto';

export const testNewUser: AuthDto = {
	email: 'test@testla.ru',
	password: '12345',
};

export const testAdminUser: AuthDto = {
	email: 'admin@testla.ru',
	password: '12345',
};
