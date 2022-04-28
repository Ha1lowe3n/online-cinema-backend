import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	HttpCode,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { FileService } from './file.service';
import { MFile } from './mfile.class';
import { UploadFileSwagger } from './swagger/decorators/upload-file.swagger.decorator';
import { IFileResponse, IRemoveFilesResponse } from './types/types';

@ApiTags('file')
@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@UploadFileSwagger()
	@HttpCode(200)
	@AuthRoleGuard('admin')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string,
	): Promise<IFileResponse[]> {
		if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
			const saveArray: MFile[] = [new MFile(file)];

			if (!file.mimetype.match(/\/(webp)$/)) {
				const buffer = await this.fileService.convertFile(file.buffer);
				saveArray.push({
					originalname: `$${file.originalname.split('.')[0]}.webp`,
					buffer,
				});
			}
			return await this.fileService.saveFiles(saveArray, folder);
		} else {
			throw new BadRequestException('Недопустимый формат файла');
		}
	}

	// @Put()
	// @HttpCode(200)
	// @AuthRoleGuard('admin')
	// @UseInterceptors(FileInterceptor('file'))
	// async updateFile(
	// 	@UploadedFile() newFiles: Express.Multer.File,
	// 	@Body('request') dto: UpdateFileDto,
	// ): Promise<IFileResponse[]> {
	// 	console.log(dto);
	// 	if (newFiles.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
	// 		const saveArray: MFile[] = [new MFile(newFiles)];

	// 		if (!newFiles.mimetype.match(/\/(webp)$/)) {
	// 			const buffer = await this.fileService.convertFile(newFiles.buffer);
	// 			saveArray.push({
	// 				originalname: `$${newFiles.originalname.split('.')[0]}.webp`,
	// 				buffer,
	// 			});
	// 		}
	// 		return await this.fileService.updateFiles(saveArray, dto);
	// 	} else {
	// 		throw new BadRequestException('Недопустимый формат файла');
	// 	}
	// }

	@Delete()
	@HttpCode(200)
	@AuthRoleGuard('admin')
	async deleteFile(@Query('folder') folder: string): Promise<IRemoveFilesResponse> {
		return await this.fileService.removeFiles(folder);
	}
}
