import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';

config();

import { UserErrorMessages } from '../../src/utils/error-messages/user-error-messages';
import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testNewUser } from './data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const usersUpdateRole = () => {
	let app: INestApplication;
	let token: string;
	let userIdForRoleUpdate: string;

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
		token = accessToken;

		// в бд должен быть обязательно user с ролью admin
		const { body } = await request(app.getHttpServer()).post('/auth/login').send(testNewUser);
		userIdForRoleUpdate = body.user._id;
	});

	it('success - update user role', async () => {
		return request(app.getHttpServer())
			.patch(`/users/update/${userIdForRoleUpdate}`)
			.set('Authorization', 'Bearer ' + token)
			.send({ isAdmin: true })
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBeDefined();
				expect(body.email).toBe('test@testla.ru');
				expect(body.isAdmin).toBeTruthy();
				expect(body.passwordHash).toBeDefined();
				expect(body.createdAt).toBeDefined();
				expect(body.updatedAt).toBeDefined();
			});
	});

	it('fail - update user without dto', async () => {
		return request(app.getHttpServer())
			.patch(`/users/update/${userIdForRoleUpdate}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(UserErrorMessages.IS_ADMIN_NOT_BOOLEAN);
			});
	});

	it('fail - update user with fake token | token expiresIn is over | token with fake id user', async () => {
		return request(app.getHttpServer())
			.patch(`/users/update/${userIdForRoleUpdate}`)
			.set(
				'Authorization',
				'Bearer ' +
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVlOGUzYjgwMmZkZDJkZjFlZTJjZGYiLCJpYXQiOjE2NTA0NjU2MTUsImV4cCI6MTY1MDQ2OTIxNX0.U-omt0K7NvU62AjUisS5jWIHWY0ZVX_UT4ge9bSAFqs',
			)
			.send({ isAdmin: false })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - update user with fake token | token expiresIn is over | token with fake id user', async () => {
		return request(app.getHttpServer())
			.patch(`/users/update/${userIdForRoleUpdate}`)
			.set(
				'Authorization',
				'Bearer ' +
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVlOGUzYjgwMmZkZDJkZjFlZTJjZGYiLCJpYXQiOjE2NTA0NjU2MTUsImV4cCI6MTY1MDQ2OTIxNX0.U-omt0K7NvU62AjUisS5jWIHWY0ZVX_UT4ge9bSAFqs',
			)
			.send({ isAdmin: false })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - token with fake id user', async () => {
		const tokenWithFakeId = sign({ _id: '123456' }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.patch(`/users/update/${userIdForRoleUpdate}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send({ isAdmin: false })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	describe('validate dto', () => {
		it('fail - isAdmin is not a boolean', async () => {
			return request(app.getHttpServer())
				.patch(`/users/update/${userIdForRoleUpdate}`)
				.set('Authorization', 'Bearer ' + token)
				.send({ isAdmin: 'test123.ru' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(UserErrorMessages.IS_ADMIN_NOT_BOOLEAN);
				});
		});
	});
};