import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { AuthErrorMessages } from './../../src/utils/error-messages/auth-error-messages';

import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testUserNewUser } from '../data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const usersGetUsersCount = () => {
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

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(testUserNewUser);
		userToken = body.accessToken;
	});

	it('success - get count users', async () => {
		return request(app.getHttpServer())
			.get(`/users/count`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(typeof body.total).toBe('number');
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.get(`/users/count`)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): user is not an admin', async () => {
		return request(app.getHttpServer())
			.get(`/users/count`)
			.set('Authorization', 'Bearer ' + userToken)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.get(`/users/count`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});
};
