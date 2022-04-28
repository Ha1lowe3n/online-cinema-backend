import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';
import { remove } from 'fs-extra';
import { path } from 'app-root-path';
import { access } from 'fs/promises';

config();

import { MockAppModule } from '../mock-app.module';
import { testAdminUser, testFileNewUser } from '../data';
import { AuthErrorMessages } from '../../src/utils/error-messages/auth-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fileUpload = () => {
	let app: INestApplication;
	let adminToken: string;
	let fileUserId: string;
	let userToken: string;

	const pathTestFilePng = `${path}/test/file/test-files/test-file.png`;
	const pathTestFileWebp = `${path}/test/file/test-files/test-file.webp`;
	const pathTestFileHtml = `${path}/test/file/test-files/test-file.html`;
	const pathTestFolder = `${path}/uploads/test`;

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

	describe('success uploads file', () => {
		it('success - upload test-file.png, created test-file.webp file and get file response', async () => {
			await remove(pathTestFolder);

			return request(app.getHttpServer())
				.post(`/file`)
				.set('Authorization', 'Bearer ' + adminToken)
				.query({ folder: 'test' })
				.attach('file', pathTestFilePng)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body).toEqual([
						{
							url: 'test/test-file.png',
							title: 'test-file.png',
						},
						{
							url: 'test/$test-file.webp',
							title: '$test-file.webp',
						},
					]);
				});
		});

		const msgSuccessUploadFileAgain =
			'success - upload test-file.png again, ' +
			'created test-file.webp again, ' +
			'rewrite files and get file response';
		it(msgSuccessUploadFileAgain, async () => {
			return request(app.getHttpServer())
				.post(`/file`)
				.set('Authorization', 'Bearer ' + adminToken)
				.query({ folder: 'test' })
				.attach('file', pathTestFilePng)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body).toEqual([
						{
							url: 'test/test-file.png',
							title: 'test-file.png',
						},
						{
							url: 'test/$test-file.webp',
							title: '$test-file.webp',
						},
					]);
				});
		});

		it('success - upload test-file.webp, upload file and get file response with only .webp', async () => {
			await remove(pathTestFolder);

			return request(app.getHttpServer())
				.post(`/file`)
				.set('Authorization', 'Bearer ' + adminToken)
				.query({ folder: 'test' })
				.attach('file', pathTestFileWebp)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body).toEqual([
						{
							url: 'test/test-file.webp',
							title: 'test-file.webp',
						},
					]);
				});
		});

		it('success - upload test-file without query, file will upload in default folder', async () => {
			const result = await request(app.getHttpServer())
				.post(`/file`)
				.set('Authorization', 'Bearer ' + adminToken)
				.attach('file', pathTestFileWebp)
				.expect(200);

			let fileCreated: boolean;
			try {
				await access(`${path}/uploads/default/test-file.webp`);
				fileCreated = true;
			} catch (error) {
				fileCreated = false;
			}

			expect(fileCreated).toBeTruthy();
			expect(result.body).toEqual([
				{
					url: 'default/test-file.webp',
					title: 'test-file.webp',
				},
			]);
		});
	});

	it('fail - only (jpg|jpeg|png|webp) files can be uploads', async () => {
		return request(app.getHttpServer())
			.post(`/file`)
			.set('Authorization', 'Bearer ' + adminToken)
			.query({ folder: 'test' })
			.attach('file', pathTestFileHtml)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Недопустимый формат файла');
			});
	});

	describe('fails with auth', () => {
		it('fail - Unauthorized (401): Unauthorized user want to upload file', async () => {
			return request(app.getHttpServer())
				.post(`/file`)
				.set('Authorization', 'Bearer ' + '123')
				.query({ folder: 'test' })
				.attach('file', pathTestFilePng)
				.expect(401)
				.then(({ body }: request.Response) => {
					expect(body.message).toBe('Unauthorized');
				});
		});

		it('fail - Unauthorized (401): token with fake user id', async () => {
			const fakeId = new Types.ObjectId().toHexString();
			const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

			return request(app.getHttpServer())
				.post(`/file`)
				.set('Authorization', 'Bearer ' + tokenWithFakeId)
				.query({ folder: 'test' })
				.attach('file', pathTestFilePng)
				.expect(401)
				.then(({ body }: request.Response) => {
					expect(body.message).toBe('Unauthorized');
				});
		});

		it('fail - Forbidden (403): not an admin want to update genre', async () => {
			return request(app.getHttpServer())
				.post(`/file`)
				.set('Authorization', 'Bearer ' + userToken)
				.query({ folder: 'test' })
				.attach('file', pathTestFilePng)
				.expect(403)
				.then(({ body }: request.Response) => {
					expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
				});
		});
	});
};
