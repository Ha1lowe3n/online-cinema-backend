import { disconnect } from 'mongoose';
import { createGenre } from './create-genre';
import { getGenreBySlug } from './get-genre-by-slug';

afterAll(async () => {
	await disconnect();
});

describe('genre/create (POST)', createGenre);
describe('genre/by-slug/:slug (GET)', getGenreBySlug);
