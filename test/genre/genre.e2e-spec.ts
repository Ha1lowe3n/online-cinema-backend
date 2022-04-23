import { disconnect } from 'mongoose';
import { createGenre } from './create-genre';

afterAll(async () => {
	await disconnect();
});

describe('genre/create (POST)', createGenre);
