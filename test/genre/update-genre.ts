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
import { CommonErrorMessages } from './../../src/utils/error-messages/common-error-messages';
import { CreateGenreDto } from '../../src/genre/dto/create-genre.dto';
import { UpdateGenreDto } from '../../src/genre/dto/update-genre.dto';
import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testGenreNewUser } from '../data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const updateGenre = () => {
	let app: INestApplication;
	let adminToken: string;
	let userToken: string;
	let genreUserId: string;
	let genreId: string;

	const updateDataGenre: UpdateGenreDto = {
		title: 'somebody',
		slug: 'some-body',
		description: 'somebody desc',
		icon: 'some icon',
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

		await request(app.getHttpServer())
			.delete(`/genre/${genreId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
	});

	it('success - update genre', async () => {
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
			.patch(`/genre/update/${genreId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(updateDataGenre)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.title).toBe(updateDataGenre.title);
				expect(body.slug).toBe(updateDataGenre.slug);
				expect(body.description).toBe(updateDataGenre.description);
				expect(body.icon).toBe(updateDataGenre.icon);
			});
	});

	it('fail - Bad request (400): invalid genre id', async () => {
		return request(app.getHttpServer())
			.patch(`/genre/update/123`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(updateDataGenre)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.ID_INVALID);
			});
	});

	it('fail - Bad request (400): empty update genre dto', async () => {
		return request(app.getHttpServer())
			.patch(`/genre/update/${genreId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send({})
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.UPDATE_DTO_EMPTY);
			});
	});

	it('fail - Unauthorized (401): Unauthorized user want to update genre', async () => {
		return request(app.getHttpServer())
			.patch(`/genre/update/${genreId}`)
			.send(updateDataGenre)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.patch(`/genre/update/${genreId}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send(updateDataGenre)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): not an admin want to update genre', async () => {
		return request(app.getHttpServer())
			.patch(`/genre/update/${genreId}`)
			.set('Authorization', 'Bearer ' + userToken)
			.send(updateDataGenre)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});

	describe('validate update dto', () => {
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
