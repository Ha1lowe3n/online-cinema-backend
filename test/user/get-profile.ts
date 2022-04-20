import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';

import { UserErrorMessages } from '../../src/utils/error-messages/user-error-messages';
import { AuthDto } from '../../src/auth/dto/auth.dto';
import { MockAppModule } from '../mock-app.module';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const usersGetProfile = () => {
	let app: INestApplication;
	let token: string;

	const testNewUser: AuthDto = {
		email: 'test@testla.ru',
		password: '12345',
	};

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MockAppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());

		await app.init();

		const {
			body: { accessToken },
		} = await request(app.getHttpServer()).post('/auth/login').send(testNewUser);
		if (!accessToken) {
			await request(app.getHttpServer()).post('/auth/register').send(testNewUser).expect(201);
			const {
				body: { accessToken },
			} = await request(app.getHttpServer())
				.post('/auth/login')
				.send(testNewUser)
				.expect(200);
			token = accessToken;
		} else {
			token = accessToken;
		}
	});

	it('success - get profile user', async () => {
		return request(app.getHttpServer())
			.get(`/users/profile`)
			.set('Authorization', 'Bearer ' + token)
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

	// test checks 3 cases
	// 1 - get profile with fake token
	// 2 - token expiresIn is over
	// 3 - token with fake id user (jwt strategy validate with findById)
	it('fail - get profile with fake token | token expiresIn is over | token with fake id user', async () => {
		return request(app.getHttpServer())
			.get(`/users/profile`)
			.set(
				'Authorization',
				'Bearer ' +
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVlOGUzYjgwMmZkZDJkZjFlZTJjZGYiLCJpYXQiOjE2NTA0NjU2MTUsImV4cCI6MTY1MDQ2OTIxNX0.U-omt0K7NvU62AjUisS5jWIHWY0ZVX_UT4ge9bSAFqs',
			)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - get profile with invalid token', async () => {
		return request(app.getHttpServer())
			.get(`/users/profile`)
			.set('Authorization', 'Bearer ' + '1234567')
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});
};
