import { UserErrorMessages } from './../../src/utils/error-messages/user-error-messages';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { AuthErrorMessages } from './../../src/utils/error-messages/auth-error-messages';

import { MockAppModule } from '../mock-app.module';
import { testAdminUser } from './data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deleteUser = () => {
	let app: INestApplication;
	let adminToken: string;
	let userToken: string;
	let userId: string;

	const testNewUserForDelete = {
		email: 'testdelete@testla.ru',
		password: '12345',
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MockAppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());

		await app.init();

		const {
			body: { accessToken },
		} = await request(app.getHttpServer()).post('/auth/login').send(testAdminUser);
		adminToken = accessToken;

		const { body } = await request(app.getHttpServer())
			.post('/auth/register')
			.send(testNewUserForDelete)
			.expect(201);

		console.log(body);

		userToken = body.accessToken;
		userId = body.user._id;
	});

	it('fail - Forbidden (403): user is not an admin', async () => {
		return request(app.getHttpServer())
			.delete(`/users/${userId}`)
			.set('Authorization', 'Bearer ' + userToken)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});

	it('success - delete user by id', async () => {
		await request(app.getHttpServer())
			.delete(`/users/${userId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBeDefined();
				expect(body.email).toBe('testdelete@testla.ru');
				expect(body.isAdmin).toBeFalsy();
				expect(body.passwordHash).toBeDefined();
				expect(body.createdAt).toBeDefined();
				expect(body.updatedAt).toBeDefined();
			});

		return request(app.getHttpServer())
			.post('/auth/login')
			.send(testNewUserForDelete)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.EMAIL_NOT_FOUND);
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.delete(`/users/${userId}`)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.delete(`/users/${userId}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Not found (404): user not found', async () => {
		return request(app.getHttpServer())
			.delete(`/users/${userId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(UserErrorMessages.USER_NOT_FOUND);
			});
	});
};
