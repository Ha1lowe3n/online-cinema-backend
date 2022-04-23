import { disconnect } from 'mongoose';
import { createGenre } from './create-genre';
import { findGenres } from './find-genres';
import { getGenreBySlug } from './get-genre-by-slug';

afterAll(async () => {
	await disconnect();
});

describe('genre/create (POST)', createGenre);
describe('genre/by-slug/:slug (GET)', getGenreBySlug);
describe('genre?searchTerm (GET)', findGenres);
