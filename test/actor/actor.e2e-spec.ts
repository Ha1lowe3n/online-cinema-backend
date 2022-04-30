import { disconnect } from 'mongoose';
import { createActor } from './create-actor';
import { findActors } from './find-actors';
import { getActorByActorId } from './get-actor-by-actor-id';
import { getActorBySlug } from './get-actor-by-slug';
import { updateActor } from './update-actor';

afterAll(async () => {
	await disconnect();
});

describe('actor/create (POST)', createActor);
describe('actor/by-slug/:slug (GET)', getActorBySlug);
describe('actor?searchTerm (GET)', findActors);
describe('actor/:actorId (GET)', getActorByActorId);
describe('actor/:genreId (PATCH)', updateActor);
// describe('actor/:genreId (DELETE)', deleteGenre);
