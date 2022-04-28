import { disconnect } from 'mongoose';
import { fileDelete } from './delete-file';
import { fileUpload } from './upload-file';

afterAll(async () => {
	await disconnect();
});

describe('/file (POST)', fileUpload);
describe('/file (DELETE)', fileDelete);
