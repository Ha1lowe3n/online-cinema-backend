import { disconnect } from 'mongoose';

import { usersGetProfileByToken } from './get-profile-by-token';
import { usersGetProfileByUserId } from './get-profile-by-user-id';
import { usersUpdate } from './update-user';
import { usersUpdateRole } from './update-user-role';

afterAll(async () => {
	await disconnect();
});

describe('users/profile (GET)', usersGetProfileByToken);
describe('users/profile/:id (GET)', usersGetProfileByUserId);
describe('users/update (PATCH)', usersUpdate);
describe('users/update/:id (PATCH)', usersUpdateRole);
