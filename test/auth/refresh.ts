import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import { MockAppModule } from '../mock-app.module';
import { RefreshTokenDto } from '../../src/auth/dto';
import { AuthErrorMessages } from '../../src/utils/error-messages/auth-error-messages';
import { testAdminUser, testAuthNewUser } from '../data';

let app: INestApplication;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const authLoginRefresh = () => {
	let refreshToken: string;
	let userId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MockAppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());

		await app.init();

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(testAuthNewUser);
		refreshToken = body.refreshToken;
		userId = body.user._id;
	});

	afterAll(async () => {
		const {
			body: { accessToken },
		} = await request(app.getHttpServer()).post('/auth/login').send(testAdminUser);

		await request(app.getHttpServer())
			.delete(`/users/${userId}`)
			.set('Authorization', 'Bearer ' + accessToken)
			.expect(200);
	});

	it('success - user refresh tokens', async () => {
		return request(app.getHttpServer())
			.post('/auth/login/refresh')
			.send({ refreshToken })
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.user._id).toBeDefined();
				expect(body.user.email).toBe(testAuthNewUser.email);
				expect(body.user.isAdmin).toBeFalsy();
				expect(body.refreshToken).toBeDefined();
				expect(body.accessToken).toBeDefined();
			});
	});

	it('fail - incorrect refresh token', async () => {
		return request(app.getHttpServer())
			.post('/auth/login/refresh')
			.send({ refreshToken: 'HTUYTT' })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.REFRESH_TOKEN_NOT_CORRECT);
			});
	});

	it('fail - refresh token is not a string', async () => {
		return request(app.getHttpServer())
			.post('/auth/login/refresh')
			.send({ refreshToken: 123 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(AuthErrorMessages.REFRESH_TOKEN_NOT_CORRECT);
			});
	});

	it('fail - refresh token is not valid', async () => {
		const refreshToken =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVlOGUzYfgjgwMmZkZDJkZjFlZTJjZGYiLCJpYXQiOjE2NTAzNjM5NjgsImV4cCI6MTY1MDM2NzU2OH0.1H3eG-CYkTEgZUp3zIvHDSPZQ5a_nAItkVhxAzn8dZ8';
		return request(app.getHttpServer())
			.post('/auth/login/refresh')
			.send({ refreshToken })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.REFRESH_TOKEN_NOT_VALID);
			});
	});
};
