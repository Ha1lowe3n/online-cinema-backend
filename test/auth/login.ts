import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MockAppModule } from '../mock-app.module';
import { AuthDto } from '../../src/auth/dto/registration.dto';
import { AuthErrorMessages } from '../../src/utils/error-messages';

let app: INestApplication;

const testAuthDto: AuthDto = {
	email: 'test@test.com',
	password: '12345',
};

beforeEach(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [MockAppModule],
	}).compile();

	app = moduleFixture.createNestApplication();
	app.useGlobalPipes(new ValidationPipe());

	await app.init();
});

afterAll(async () => {
	await disconnect();
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const authLogin = () => {
	it('success - user authorization', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(testAuthDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.email).toBe(testAuthDto.email);
				expect(body.passwordHash).toBeDefined();
				expect(body.isAdmin).toBeFalsy();
				expect(body.favoritesMovies).toEqual([]);
				expect(body.createdAt).toBeDefined();
				expect(body.updatedAt).toBeDefined();
			});
	});

	it('fail - user authorization with not registered email', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...testAuthDto, email: 'bla@bla.com' })
			.expect(400)
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
