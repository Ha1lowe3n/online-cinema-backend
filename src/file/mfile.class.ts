export class MFile {
	originalname: string;
	buffer: Buffer;

	constructor(file: Express.Multer.File) {
		this.buffer = file.buffer;
		this.originalname = file.originalname;
	}
}
