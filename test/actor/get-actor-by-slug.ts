import { testActorNewUser, testNewActor } from '../data';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { ActorErrorMessages } from '../../src/utils/error-messages/actor-error-messages';

import { MockAppModule } from '../mock-app.module';
import { testAdminUser } from '../data';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getActorBySlug = () => {
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

	it('success - get actor by slug', async () => {
		await request(app.getHttpServer())
			.post(`/actor/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewActor)
			.expect(201)
			.then(({ body }: request.Response) => {
				actorId = body._id;
				expect(body.name).toBe(testNewActor.name);
				expect(body.slug).toBe(testNewActor.slug);
				expect(body.photo).toBe(testNewActor.photo);
			});

		return request(app.getHttpServer())
			.get(`/actor/by-slug/${testNewActor.slug}`)
			.set('Authorization', 'Bearer ' + userToken)
			.send(testNewActor)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.name).toBe(testNewActor.name);
				expect(body.slug).toBe(testNewActor.slug);
				expect(body.photo).toBe(testNewActor.photo);
			});
	});

	it('fail - Unauthorized (401): Unauthorized', async () => {
		return request(app.getHttpServer())
			.get(`/actor/by-slug/${testNewActor.slug}`)
			.send(testNewActor)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.get(`/actor/by-slug/${testNewActor.slug}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send(testNewActor)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Not Found (404): actor not found by slug', async () => {
		return request(app.getHttpServer())
			.get(`/actor/by-slug/fake-slug`)
			.set('Authorization', 'Bearer ' + userToken)
			.send(testNewActor)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ActorErrorMessages.ACTOR_NOT_FOUND);
			});
	});
};
