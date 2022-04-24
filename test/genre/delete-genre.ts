import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { AuthErrorMessages } from './../../src/utils/error-messages/auth-error-messages';
import { GenreErrorMessages } from './../../src/utils/error-messages/genre-error-messages';
import { CommonErrorMessages } from './../../src/utils/error-messages/common-error-messages';
import { CreateGenreDto } from '../../src/genre/dto/create-genre.dto';
import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testGenreNewUser } from '../data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deleteGenre = () => {
	let app: INestApplication;
	let adminToken: string;
	let userToken: string;
	let genreUserId: string;
	let genreId: string;

	const newGenreForDelete: CreateGenreDto = {
		title: 'new genre for delete',
		slug: 'new-genre-for-delete',
		description: 'new genre for delete desc',
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

	it('success - delete genre', async () => {
		await request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(newGenreForDelete)
			.expect(201)
			.then(({ body }: request.Response) => {
				genreId = body._id;
				expect(body.title).toBe(newGenreForDelete.title);
				expect(body.slug).toBe(newGenreForDelete.slug);
				expect(body.description).toBe(newGenreForDelete.description);
			});

		await request(app.getHttpServer())
			.delete(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.title).toBe(newGenreForDelete.title);
				expect(body.slug).toBe(newGenreForDelete.slug);
				expect(body.description).toBe(newGenreForDelete.description);
			});

		return request(app.getHttpServer())
			.get(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(GenreErrorMessages.GENRE_NOT_FOUND);
			});
	});

	it('fail - Bad request (400): invalid genre id', async () => {
		return request(app.getHttpServer())
			.delete(`/genre/123`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.ID_INVALID);
			});
	});

	it('fail - Unauthorized (401): Unauthorized user want to update genre', async () => {
		return request(app.getHttpServer())
			.delete(`/genre/${genreId}`)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.delete(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): not an admin want to update genre', async () => {
		return request(app.getHttpServer())
			.delete(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + userToken)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});
};
