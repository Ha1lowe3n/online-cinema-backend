import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';

config();

import { UserErrorMessages } from '../../src/utils/error-messages/user-error-messages';

import { MockAppModule } from '../mock-app.module';
import { AuthErrorMessages } from '../../src/utils/error-messages/auth-error-messages';
import { testAdminUser, testUserNewUser } from '../data';
import { CommonErrorMessages } from '../../src/utils/error-messages/common-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const usersUpdate = () => {
	let app: INestApplication;
	let token: string;
	let updatedUserId: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MockAppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());

		await app.init();

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(testUserNewUser)
			.expect(200);
		token = body.accessToken;
		updatedUserId = body.user._id;
	});

	afterAll(async () => {
		const {
			body: { accessToken },
		} = await request(app.getHttpServer()).post('/auth/login').send(testAdminUser);

		await request(app.getHttpServer())
			.delete(`/users/${updatedUserId}`)
			.set('Authorization', 'Bearer ' + accessToken)
			.expect(200);
	});

	it('success - update user', async () => {
		return request(app.getHttpServer())
			.patch(`/users/update`)
			.set('Authorization', 'Bearer ' + token)
			.send({ email: 'test123@testla.ru' })
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body._id).toBeDefined();
				expect(body.email).toBe('test123@testla.ru');
				expect(body.isAdmin).toBeFalsy();
				expect(body.passwordHash).toBeDefined();
				expect(body.createdAt).toBeDefined();
				expect(body.updatedAt).toBeDefined();
			});
	});

	it('fail - update user without dto', async () => {
		return request(app.getHttpServer())
			.patch(`/users/update`)
			.set('Authorization', 'Bearer ' + token)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.UPDATE_DTO_EMPTY);
			});
	});

	it('fail - update user with fake token | token expiresIn is over | token with fake id user', async () => {
		return request(app.getHttpServer())
			.patch(`/users/update`)
			.set(
				'Authorization',
				'Bearer ' +
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVlOGUzYjgwMmZkZDJkZjFlZTJjZGYiLCJpYXQiOjE2NTA0NjU2MTUsImV4cCI6MTY1MDQ2OTIxNX0.U-omt0K7NvU62AjUisS5jWIHWY0ZVX_UT4ge9bSAFqs',
			)
			.send({ email: 'test123@testla.ru' })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - token with fake id user', async () => {
		const tokenWithFakeId = sign({ _id: '123456' }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.patch(`/users/update`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send({ email: 'test123@testla.ru' })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	describe('validate dto', () => {
		it('fail - invalid email', async () => {
			return request(app.getHttpServer())
				.patch(`/users/update`)
				.set('Authorization', 'Bearer ' + token)
				.send({ email: 'test123.ru' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.EMAIL_NOT_VALID);
				});
		});

		it('fail - password is too short', async () => {
			return request(app.getHttpServer())
				.patch(`/users/update`)
				.set('Authorization', 'Bearer ' + token)
				.send({ password: '123' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.PASSWORD_LONG);
				});
		});

		it('fail - password is too long', async () => {
			return request(app.getHttpServer())
				.patch(`/users/update`)
				.set('Authorization', 'Bearer ' + token)
				.send({
					password:
						'342354325435324534534534534534534444444444444444444444444444444444444',
				})
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.PASSWORD_LONG);
				});
		});
	});
};
