import { testNewGenre } from '../data';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';

import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testGenreNewUser } from '../data';
import { CreateGenreDto } from '../../src/genre/dto/create-genre.dto';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findGenres = () => {
	let app: INestApplication;
	let adminToken: string;
	let genreUserId: string;
	let genreId1: string;
	let genreId2: string;

	const newGenre: CreateGenreDto = {
		title: 'new genre',
		slug: 'new genre',
		description: 'new genre desc',
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

			genreUserId = body.user._id;
		} else {
			genreUserId = body.user._id;
		}
	});

	afterAll(async () => {
		await request(app.getHttpServer())
			.delete(`/users/${genreUserId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
		await request(app.getHttpServer())
			.delete(`/genre/${genreId1}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
		await request(app.getHttpServer())
			.delete(`/genre/${genreId2}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
	});

	it('success - find all genres', async () => {
		await request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewGenre)
			.expect(201)
			.then(({ body }: request.Response) => {
				genreId1 = body._id;
				expect(body.title).toBe(testNewGenre.title);
			});
		await request(app.getHttpServer())
			.post(`/genre/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(newGenre)
			.expect(201)
			.then(({ body }: request.Response) => {
				genreId2 = body._id;
				expect(body.title).toBe(newGenre.title);
			});

		return request(app.getHttpServer())
			.get(`/genre`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(Array.isArray(body)).toBeTruthy();
				expect(body).toHaveLength(2);
				expect(body[0].title).toBe(testNewGenre.title);
				expect(body[1].title).toBe(newGenre.title);
			});
	});

	it('success - find genres with searchTerm', async () => {
		return request(app.getHttpServer())
			.get(`/genre?searchTerm=new`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(Array.isArray(body)).toBeTruthy();
				expect(body).toHaveLength(1);
				expect(body[0].title).toBe(newGenre.title);
			});
	});

	it('success - get empty array of genres with jest searchTerm', async () => {
		return request(app.getHttpServer())
			.get(`/genre?searchTerm=hoj9jihjjetgergerijeio404i3j0jt3i4joi`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(Array.isArray(body)).toBeTruthy();
				expect(body).toHaveLength(0);
			});
	});
};
