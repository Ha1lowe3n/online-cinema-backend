import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { MockAppModule } from '../mock-app.module';

import { AuthErrorMessages } from '../../src/utils/error-messages';
import { testAuthDto } from './data';

let app: INestApplication;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const authLogin = () => {
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MockAppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());

		await app.init();
	});

	it('success - user authorization', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(testAuthDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.user._id).toBeDefined();
				expect(body.user.email).toBe('test@test.com');
				expect(body.user.isAdmin).toBeFalsy();
				expect(body.refreshToken).toBeDefined();
				expect(body.accessToken).toBeDefined();
			});
	});

	it('fail - user authorization with not registered email', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...testAuthDto, email: 'bla@bla.com' })
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.EMAIL_NOT_FOUND);
			});
	});

	it('fail - user authorization with failed password', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...testAuthDto, password: '222222' })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.PASSWORD_FAILED);
			});
	});

	describe('validate registration DTO', () => {
		it('fail - invalid email', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send({ ...testAuthDto, email: 'blaaa' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.EMAIL_NOT_VALID);
				});
		});

		it('fail - short password', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send({ ...testAuthDto, password: '123' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.PASSWORD_LONG);
				});
		});

		it('fail - too long password', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send({
					...testAuthDto,
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
