import { testActorNewUser, testNewActor } from '../data';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';

import { MockAppModule } from '../mock-app.module';
import { testAdminUser } from '../data';
import { CreateActorDto } from '../../src/actor/dto/create-actor.dto';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findActors = () => {
	let app: INestApplication;
	let adminToken: string;
	let actorUserId: string;
	let actorId1: string;
	let actorId2: string;

	const newActor: CreateActorDto = {
		name: 'new actor',
		slug: 'new-actor',
		photo: 'some photo',
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

			actorUserId = body.user._id;
		} else {
			actorUserId = body.user._id;
		}
	});

	afterAll(async () => {
		await request(app.getHttpServer())
			.delete(`/users/${actorUserId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);

		await request(app.getHttpServer())
			.delete(`/actor/${actorId1}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
		await request(app.getHttpServer())
			.delete(`/actor/${actorId2}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.expect(200);
	});

	it("success - get empty array of actors if actors don't registered in database", async () => {
		return request(app.getHttpServer())
			.get(`/actor`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body).toEqual([]);
			});
	});

	it('success - get actor by slug', async () => {
		await request(app.getHttpServer())
			.post(`/actor/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(testNewActor)
			.expect(201)
			.then(({ body }: request.Response) => {
				actorId1 = body._id;
				expect(body.name).toBe(testNewActor.name);
				expect(body.slug).toBe(testNewActor.slug);
				expect(body.photo).toBe(testNewActor.photo);
			});
		await request(app.getHttpServer())
			.post(`/actor/create`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(newActor)
			.expect(201)
			.then(({ body }: request.Response) => {
				actorId2 = body._id;
				expect(body.name).toBe(newActor.name);
				expect(body.slug).toBe(newActor.slug);
				expect(body.photo).toBe(newActor.photo);
			});

		return request(app.getHttpServer())
			.get(`/actor`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(Array.isArray(body)).toBeTruthy();
				expect(body).toHaveLength(2);
				expect(body[0].name).toBe(testNewActor.name);
				expect(body[1].name).toBe(newActor.name);
			});
	});

	it('success - get array of actors by query searchTeam', async () => {
		return request(app.getHttpServer())
			.get(`/actor?searchTerm=new`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(Array.isArray(body)).toBeTruthy();
				expect(body).toHaveLength(1);
				expect(body[0].name).toBe(newActor.name);
			});
	});
};
