import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testFileNewUser } from '../data';
import { AuthErrorMessages } from '../../src/utils/error-messages/auth-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fileDelete = () => {
	let app: INestApplication;
	let adminToken: string;
	let fileUserId: string;
	let userToken: string;

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
			.send(testFileNewUser);
		if (!body.accessToken) {
			await request(app.getHttpServer())
				.post('/auth/register')
				.send(testFileNewUser)
				.expect(201);
			const { body } = await request(app.getHttpServer())
				.post('/auth/login')
				.send(testFileNewUser)
				.expect(200);
			userToken = body.accessToken;
			fileUserId = body.user._id;
		} else {
			userToken = body.accessToken;
			fileUserId = body.user._id;
		}
	});

	afterAll(async () => {
		await request(app.getHttpServer())
			.delete(`/users/${fileUserId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
	});

	// afterEach(function () {
	// 	console.log(this);
	// });

	it('success - delete folder', async () => {
		return request(app.getHttpServer())
			.delete(`/file`)
			.set('Authorization', 'Bearer ' + adminToken)
			.query({ folder: 'test' })
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Файлы успешно удалены');
			});
	});

	it('fail - Not found (404): folder', async () => {
		return request(app.getHttpServer())
			.delete(`/file`)
			.set('Authorization', 'Bearer ' + adminToken)
			.query({ folder: 'somefolder' })
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Папка не существует');
			});
	});

	describe('fails with auth', () => {
		it('fail - Unauthorized (401): Unauthorized user want to upload file', async () => {
			return request(app.getHttpServer())
				.delete(`/file`)
				.query({ folder: 'test' })
				.expect(401)
				.then(({ body }: request.Response) => {
					expect(body.message).toBe('Unauthorized');
				});
		});

		it('fail - Unauthorized (401): token with fake user id', async () => {
			const fakeId = new Types.ObjectId().toHexString();
			const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

			return request(app.getHttpServer())
				.delete(`/file`)
				.set('Authorization', 'Bearer ' + tokenWithFakeId)
				.query({ folder: 'test' })
				.expect(401)
				.then(({ body }: request.Response) => {
					expect(body.message).toBe('Unauthorized');
				});
		});

		it('fail - Forbidden (403): not an admin want to update genre', async () => {
			return request(app.getHttpServer())
				.delete(`/file`)
				.set('Authorization', 'Bearer ' + userToken)
				.query({ folder: 'test' })
				.expect(403)
				.then(({ body }: request.Response) => {
					expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
				});
		});
	});
};
