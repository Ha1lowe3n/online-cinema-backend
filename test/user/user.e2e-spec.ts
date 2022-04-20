import { disconnect } from 'mongoose';

import { usersGetProfile } from './get-profile';

afterAll(async () => {
	await disconnect();
});

describe('users/profile (GET)', usersGetProfile);
