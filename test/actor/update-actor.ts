import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { Types } from 'mongoose';

config();

import { testActorNewUser, testNewActor } from './../data';
import { AuthErrorMessages } from './../../src/utils/error-messages/auth-error-messages';
import { CommonErrorMessages } from './../../src/utils/error-messages/common-error-messages';
import { MockAppModule } from '../mock-app.module';
import { testAdminUser } from '../data';
import { UpdateActorDto } from '../../src/actor/dto/update-actor.dto';
import { ActorErrorMessages } from '../../src/utils/error-messages/actor-error-messages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const updateActor = () => {
	let app: INestApplication;
	let adminToken: string;
	let userToken: string;
	let actorUserId: string;
	let actorId: string;

	const updateActorData: UpdateActorDto = {
		name: 'update name',
		slug: 'update-slug',
		photo: 'update photo',
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

	it('success - update actor', async () => {
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
			.patch(`/actor/${actorId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(updateActorData)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.name).toBe(updateActorData.name);
				expect(body.slug).toBe(updateActorData.slug);
				expect(body.description).toBe(updateActorData.photo);
			});
	});

	it('fail - Bad request (400): invalid genre id', async () => {
		return request(app.getHttpServer())
			.patch(`/genre/123`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(updateActorData)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.ID_INVALID);
			});
	});

	it('fail - Bad request (400): empty update genre dto', async () => {
		return request(app.getHttpServer())
			.patch(`/genre/${actorId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send({})
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(CommonErrorMessages.UPDATE_DTO_EMPTY);
			});
	});

	it('fail - Unauthorized (401): Unauthorized user want to update genre', async () => {
		return request(app.getHttpServer())
			.patch(`/genre/${actorId}`)
			.send(updateActorData)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Unauthorized (401): token with fake user id', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		const tokenWithFakeId = sign({ _id: fakeId }, process.env.JWT_SECRET_KEY);

		return request(app.getHttpServer())
			.patch(`/actor/${actorId}`)
			.set('Authorization', 'Bearer ' + tokenWithFakeId)
			.send(updateActorData)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe('Unauthorized');
			});
	});

	it('fail - Forbidden (403): not an admin want to update actor', async () => {
		return request(app.getHttpServer())
			.patch(`/actor/${actorId}`)
			.set('Authorization', 'Bearer ' + userToken)
			.send(updateActorData)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(AuthErrorMessages.FORBIDDEN);
			});
	});

	it('fail - Not found (404): actor not found', async () => {
		const fakeId = new Types.ObjectId().toHexString();
		return request(app.getHttpServer())
			.patch(`/actor/${fakeId}`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send(updateActorData)
			.expect(404)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ActorErrorMessages.ACTOR_NOT_FOUND);
			});
	});

	describe('validate update dto', () => {
		it('fail - Bad request (400): actor name cant be an empty', async () => {
			return request(app.getHttpServer())
				.patch(`/actor/${actorId}`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ name: '' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ActorErrorMessages.ACTOR_NAME_CANT_BE_EMPTY);
				});
		});

		it('fail - Bad request (400): actor name should be a string', async () => {
			return request(app.getHttpServer())
				.patch(`/actor/${actorId}`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ name: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ActorErrorMessages.ACTOR_NAME_SHOULD_BE_STRING);
				});
		});

		it('fail - Bad request (400): actor slug should be a string', async () => {
			return request(app.getHttpServer())
				.patch(`/actor/${actorId}`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ slug: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ActorErrorMessages.ACTOR_SLUG_SHOULD_BE_STRING);
				});
		});

		it('fail - Bad request (400): actor slug cant be empty', async () => {
			return request(app.getHttpServer())
				.patch(`/actor/${actorId}`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ slug: '' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ActorErrorMessages.ACTOR_SLUG_CANT_BE_EMPTY);
				});
		});

		it('fail - Bad request (400): actor photo should be a string way to file', async () => {
			return request(app.getHttpServer())
				.patch(`/actor/${actorId}`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ photo: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ActorErrorMessages.ACTOR_PHOTO_SHOULD_BE_STRING);
				});
		});

		it('fail - Bad request (400): actor photo cant be empty', async () => {
			return request(app.getHttpServer())
				.patch(`/actor/${actorId}`)
				.set('Authorization', 'Bearer ' + adminToken)
				.send({ photo: '' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ActorErrorMessages.ACTOR_PHOTO_CANT_BE_EMPTY);
				});
		});
	});
};
