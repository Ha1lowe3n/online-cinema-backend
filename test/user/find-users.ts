import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { AuthErrorMessages } from './../../src/utils/error-messages/auth-error-messages';

import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testNewUser } from './data';
import { UserModel } from '../../src/user/user.model';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findUsers = () => {
	let app: INestApplication;
	let adminToken: string;
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
		userToken = body.accessToken;
	});

	it('success - get users', async () => {
		return request(app.getHttpServer())
			.get(`/users`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(Array.isArray(body)).toBeTruthy();

				// body.length может быть равен 0, если бд пустая, но там у нас точно находиться admin
				expect(body.length).toBeGreaterThan(0);

				const admin = body.find((user: UserModel) => user.email === testAdminUser.email);
				expect(admin).toBeTruthy();
			});
	});

	it('success - get user with query searchTerm by email', async () => {
		return request(app.getHttpServer())
			.get(`/users?searchTerm=admin`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(Array.isArray(body)).toBeTruthy();
				expect(body[0].email).toBe(testAdminUser.email);
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.get(`/users`)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.get(`/users`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): user is not an admin', async () => {
		return request(app.getHttpServer())
			.get(`/users`)
			.set('Authorization', 'Bearer ' + userToken)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});
};
