import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { UserErrorMessages } from '../../src/utils/error-messages/user-error-messages';
import { CommonErrorMessages } from './../../src/utils/error-messages/common-error-messages';
import { AuthErrorMessages } from './../../src/utils/error-messages/auth-error-messages';

import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testNewUser } from './data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const usersGetProfileByUserId = () => {
	let app: INestApplication;
	let adminToken: string;
	let userID: string;
	let userToken: string;

	beforeEach(async () => {
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

		const { body } = await request(app.getHttpServer()).post('/auth/login').send(testNewUser);
		userID = body.user._id;
		userToken = body.accessToken;
	});

	it('success - get profile user by id', async () => {
		return request(app.getHttpServer())
			.get(`/users/profile/${userID}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBeDefined();
				expect(body.email).toBe('test@testla.ru');
				expect(body.isAdmin).toBeFalsy();
				expect(body.passwordHash).toBeDefined();
				expect(body.createdAt).toBeDefined();
				expect(body.updatedAt).toBeDefined();
			});
	});

	it('fail - bad request (400): user id not valid', async () => {
		return request(app.getHttpServer())
			.get(`/users/profile/12345`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.ID_INVALID);
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.get(`/users/profile/${userID}`)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const tokenWithFakeId = sign({ _id: '123456' }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.get(`/users/profile/${userID}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): user is not an admin', async () => {
		return request(app.getHttpServer())
			.get(`/users/profile/${userID}`)
			.set('Authorization', 'Bearer ' + userToken)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});

	it('fail - Not found (404): user is not found', async () => {
		const fakeId = new Types.ObjectId().toHexString();

		return request(app.getHttpServer())
			.get(`/users/profile/${fakeId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(UserErrorMessages.USER_NOT_FOUND);
			});
	});
};
