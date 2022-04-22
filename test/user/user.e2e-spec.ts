import { disconnect } from 'mongoose';
import { deleteUser } from './delete-user';
import { findUsers } from './find-users';
import { usersGetUsersCount } from './get-cout-users';

import { usersGetProfileByToken } from './get-profile-by-token';
import { usersGetProfileByUserId } from './get-profile-by-user-id';
import { usersUpdate } from './update-user';
import { usersUpdateRole } from './update-user-role';

afterAll(async () => {
	await disconnect();
});

describe('users/profile (GET)', usersGetProfileByToken);
describe('users/profile/:id (GET)', usersGetProfileByUserId);
describe('users/count (GET)', usersGetUsersCount);
describe('users (GET)', findUsers);
describe('users/update (PATCH)', usersUpdate);
describe('users/update/:id (PATCH)', usersUpdateRole);
describe('users/:id (DELETE)', deleteUser);
