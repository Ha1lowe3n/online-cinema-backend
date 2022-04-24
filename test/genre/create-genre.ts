import { testNewGenre } from './../data';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { AuthErrorMessages } from './../../src/utils/error-messages/auth-error-messages';
import { GenreErrorMessages } from './../../src/utils/error-messages/genre-error-messages';

import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testGenreNewUser } from '../data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createGenre = () => {
	let app: INestApplication;
	let adminToken: string;
	let userToken: string;
	let genreUserId: string;
	let genreId: string;

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
			.send(testGenreNewUser);
		if (!body.accessToken) {
			await request(app.getHttpServer())
				.post('/auth/register')
				.send(testGenreNewUser)
				.expect(201);
			const { body } = await request(app.getHttpServer())
				.post('/auth/login')
				.send(testGenreNewUser)
				.expect(200);
			userToken = body.accessToken;
			genreUserId = body.user._id;
		} else {
			userToken = body.accessToken;
			genreUserId = body.user._id;
		}
	});

	afterAll(async () => {
		await request(app.getHttpServer())
			.delete(`/users/${genreUserId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);

		await request(app.getHttpServer())
			.delete(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
	});

	it('success - create genre', async () => {
		return request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewGenre)
			.expect(201)
			.then(({ body }: request.Response) => {
				genreId = body._id;
				expect(body.title).toBe(testNewGenre.title);
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.post(`/genre/create`)
			.send(testNewGenre)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send(testNewGenre)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): not an admin want to create genre', async () => {
		return request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + userToken)
			.send(testNewGenre)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});

	it('fail - Conflict (409): genre is already registered', async () => {
		return request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewGenre)
			.expect(409)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(GenreErrorMessages.GENRE_ALREADY_REGISTERED);
			});
	});

	describe('validate create dto', () => {
		it('fail - Bad request (400): genre title cant be an empty', async () => {
			return request(app.getHttpServer())
				.post(`/genre/create`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ ...testNewGenre, title: '' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(GenreErrorMessages.GENRE_TITLE_CANT_BE_EMPTY);
				});
		});

		it('fail - Bad request (400): genre title should be a string', async () => {
			return request(app.getHttpServer())
				.post(`/genre/create`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ ...testNewGenre, title: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(GenreErrorMessages.GENRE_TITLE_SHOULD_BE_STRING);
				});
		});

		it('fail - Bad request (400): slug should be a string', async () => {
			return request(app.getHttpServer())
				.post(`/genre/create`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ ...testNewGenre, slug: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(GenreErrorMessages.GENRE_SLUG_SHOULD_BE_STRING);
				});
		});

		it('fail - Bad request (400): description should be a string', async () => {
			return request(app.getHttpServer())
				.post(`/genre/create`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ ...testNewGenre, description: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(
						GenreErrorMessages.GENRE_DESCRIPTION_SHOULD_BE_STRING,
					);
				});
		});

		it('fail - Bad request (400): icon should be a string', async () => {
			return request(app.getHttpServer())
				.post(`/genre/create`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ ...testNewGenre, icon: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(GenreErrorMessages.GENRE_ICON_SHOULD_BE_STRING);
				});
		});
	});
};
