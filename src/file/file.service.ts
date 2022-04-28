import { Injectable, BadRequestException } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile, remove } from 'fs-extra';
import { access } from 'fs/promises';
import * as sharp from 'sharp';
import { UpdateFileDto } from './dto/update-file-dto';
import { MFile } from './mfile.class';
import { IFileResponse, IRemoveFilesResponse } from './types/types';

@Injectable()
export class FileService {
	async saveFiles(files: MFile[], folder = 'default'): Promise<IFileResponse[]> {
		const uploadFolder = `${path}/uploads/${folder}`;
		await ensureDir(uploadFolder);

		const res: IFileResponse[] = [];
		for (const file of files) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			res.push({ url: `${folder}/${file.originalname}`, title: file.originalname });
		}
		return res;
	}

	async updateFiles(
		newFiles: MFile[],
		{ folder, fileTitleForDelete }: UpdateFileDto,
	): Promise<IFileResponse[]> {
		const uploadFolder = `${path}/uploads/${folder}`;
		try {
			await access(uploadFolder);
		} catch (err) {
			throw new BadRequestException('Папка не существует');
		}

		const fileName = fileTitleForDelete.split('.')[0];
		const fileExt = fileTitleForDelete.split('.')[1];

		await remove(`${uploadFolder}/${fileTitleForDelete}`);
		if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'jpeg') {
			await remove(`${uploadFolder}/$${fileName}.webp`);
		}

		const res: IFileResponse[] = [];
		for (const file of newFiles) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			res.push({ url: `${folder}/${file.originalname}`, title: file.originalname });
		}

		return res;
	}

	async removeFiles(folder: string): Promise<IRemoveFilesResponse> {
		const uploadFolder = `${path}/uploads/${folder}`;
		try {
			await access(uploadFolder);
			await remove(uploadFolder);
		} catch (err) {
			throw new BadRequestException('Папка не существует');
		}

		return {
			message: 'Файлы успешно удалены',
		};
	}

	async convertFile(file: Buffer): Promise<Buffer> {
		return await sharp(file).webp().toBuffer();
	}
}
