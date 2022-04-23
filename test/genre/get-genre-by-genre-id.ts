import { testNewGenre } from './../data';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { GenreErrorMessages } from './../../src/utils/error-messages/genre-error-messages';
import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testGenreNewUser } from '../data';
import { CreateGenreDto } from '../../src/genre/dto/create-genre.dto';
import { AuthErrorMessages } from '../../src/utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from '../../src/utils/error-messages/common-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getGenreByGenreId = () => {
	let app: INestApplication;
	let adminToken: string;
	let userToken: string;
	let genreUserId: string;
	let genreId: string;

	const newGenre2: CreateGenreDto = {
		title: 'new genre 2',
		slug: 'new-genre-2',
		description: 'new genre 2 desc',
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
	});

	it('success - get genre by slug', async () => {
		await request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(newGenre2)
			.expect(201)
			.then(({ body }: request.Response) => {
				genreId = body._id;
				expect(body.title).toBe(newGenre2.title);
			});

		return request(app.getHttpServer())
			.get(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.slug).toBe(newGenre2.slug);
				expect(body.title).toBe(newGenre2.title);
			});
	});

	it('fail - Bad request (400): invalid genre id', async () => {
		return request(app.getHttpServer())
			.get(`/genre/123`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewGenre)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.ID_INVALID);
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.get(`/genre/${genreId}`)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.get(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send(testNewGenre)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): user is not admin', async () => {
		return request(app.getHttpServer())
			.get(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + userToken)
			.send(testNewGenre)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});

	it('fail - Not found (404): genre by slug not found', async () => {
		const fakeId = new Types.ObjectId().toHexString();

		return request(app.getHttpServer())
			.get(`/genre/${fakeId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewGenre)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(GenreErrorMessages.GENRE_NOT_FOUND);
			});
	});
};
