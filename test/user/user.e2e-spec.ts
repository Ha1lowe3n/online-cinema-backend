import { disconnect } from 'mongoose';

import { usersGetProfile } from './get-profile';
import { usersUpdate } from './update-user';
import { usersUpdateRole } from './update-user-role';

afterAll(async () => {
	await disconnect();
});

describe('users/profile (GET)', usersGetProfile);
describe('users/update (PATCH)', usersUpdate);
describe('users/update/:id (PATCH)', usersUpdateRole);
