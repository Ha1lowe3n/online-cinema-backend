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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getGenreBySlug = () => {
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

	it('success - get genre by slug', async () => {
		await request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewGenre)
			.expect(201)
			.then(({ body }: request.Response) => {
				genreId = body._id;
				expect(body.title).toBe(testNewGenre.title);
			});

		return request(app.getHttpServer())
			.get(`/genre/by-slug/${testNewGenre.slug}`)
			.set('Authorization', 'Bearer ' + userToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				genreId = body._id;
				expect(body.slug).toBe(testNewGenre.slug);
				expect(body.title).toBe(testNewGenre.title);
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.get(`/genre/by-slug/${testNewGenre.slug}`)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.get(`/genre/by-slug/${testNewGenre.slug}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send(testNewGenre)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Not found (404): genre by slug not found', async () => {
		return request(app.getHttpServer())
			.get(`/genre/by-slug/blaa`)
			.set('Authorization', 'Bearer ' + userToken)
			.send(testNewGenre)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(GenreErrorMessages.GENRE_NOT_FOUND);
			});
	});
};
