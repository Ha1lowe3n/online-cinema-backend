import { CreateActorDto } from '../src/actor/dto/create-actor.dto';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreateGenreDto } from '../src/genre/dto/create-genre.dto';

export const testAuthNewUser: AuthDto = {
	email: 'testAuth@test.ru',
	password: '12345',
};
export const testGenreNewUser: AuthDto = {
	email: 'testGenre@test.ru',
	password: '12345',
};
export const testUserNewUser: AuthDto = {
	email: 'testUser@test.ru',
	password: '12345',
};
export const testFileNewUser: AuthDto = {
	email: 'testFile@test.ru',
	password: '12345',
};
export const testActorNewUser: AuthDto = {
	email: 'testActor@test.ru',
	password: '12345',
};

export const testAdminUser: AuthDto = {
	email: 'admin@test.ru',
	password: '12345',
};

export const testNewGenre: CreateGenreDto = {
	title: 'horror',
	slug: 'some-slug',
};

export const testNewActor: CreateActorDto = {
	name: 'John Smith',
	slug: 'john-smith',
	photo: 'some photo',
};
