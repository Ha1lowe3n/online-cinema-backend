import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { testActorNewUser, testNewActor } from './../data';
import { ActorErrorMessages } from '../../src/utils/error-messages/actor-error-messages';
import { MockAppModule } from '../mock-app.module';
import { testAdminUser } from '../data';
import { AuthErrorMessages } from '../../src/utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from '../../src/utils/error-messages/common-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getActorByActorId = () => {
	let app: INestApplication;
	let adminToken: string;
	let userToken: string;
	let actorUserId: string;
	let actorId: string;

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
			.send(testActorNewUser);
		if (!body.accessToken) {
			await request(app.getHttpServer())
				.post('/auth/register')
				.send(testActorNewUser)
				.expect(201);
			const { body } = await request(app.getHttpServer())
				.post('/auth/login')
				.send(testActorNewUser)
				.expect(200);
			userToken = body.accessToken;
			actorUserId = body.user._id;
		} else {
			userToken = body.accessToken;
			actorUserId = body.user._id;
		}
	});

	afterAll(async () => {
		await request(app.getHttpServer())
			.delete(`/users/${actorUserId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);

		await request(app.getHttpServer())
			.delete(`/actor/${actorId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
	});

	it('success - get actor by actor id', async () => {
		await request(app.getHttpServer())
			.post(`/actor/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewActor)
			.expect(201)
			.then(({ body }: request.Response) => {
				actorId = body._id;
				expect(body.name).toBe(testNewActor.name);
			});

		return request(app.getHttpServer())
			.get(`/actor/${actorId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.slug).toBe(testNewActor.slug);
				expect(body.name).toBe(testNewActor.name);
			});
	});

	it('fail - Bad request (400): invalid genre id', async () => {
		return request(app.getHttpServer())
			.get(`/actor/123`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewActor)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.ID_INVALID);
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.get(`/actor/${actorId}`)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.get(`/actor/${actorId}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send(testNewActor)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): user is not admin', async () => {
		return request(app.getHttpServer())
			.get(`/actor/${actorId}`)
			.set('Authorization', 'Bearer ' + userToken)
			.send(testNewActor)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});

	it('fail - Not found (404): genre by slug not found', async () => {
		const fakeId = new Types.ObjectId().toHexString();

		return request(app.getHttpServer())
			.get(`/actor/${fakeId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewActor)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ActorErrorMessages.ACTOR_NOT_FOUND);
			});
	});
};
