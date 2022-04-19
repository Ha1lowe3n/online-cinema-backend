import { disconnect } from 'mongoose';

import { authRegister } from './register';
import { authLogin } from './login';
import { authLoginRefresh } from './refresh';

afterAll(async () => {
	await disconnect();
});

describe('auth/register (POST)', authRegister);
describe('auth/login (POST)', authLogin);
describe('auth/login/refresh (POST)', authLoginRefresh);
