import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType } from '@typegoose/typegoose';

import { GenreErrorMessages } from './../utils/error-messages/genre-error-messages';
import { CommonErrorMessages } from './../utils/error-messages/common-error-messages';
import { GenreModel } from './genre.model';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenreService {
	constructor(@InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>) {}

	async getGenreBySlug(slug: string): Promise<DocumentType<GenreModel>> {
		const findGenre = await this.genreModel.findOne({ slug });
		if (!findGenre) throw new NotFoundException(GenreErrorMessages.GENRE_NOT_FOUND);
		return findGenre;
	}

	async findGenres(searchTerm?: string): Promise<DocumentType<GenreModel>[]> {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [
					{ title: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
					{ description: new RegExp(searchTerm, 'i') },
				],
			};
		}
		return await this.genreModel.find(options).select('-updatedAt -__v').sort({ createdAt: 1 });
	}

	// --------------- ADMIN cases ---------------
	async getGenreById(_id: string): Promise<DocumentType<GenreModel>> {
		const genre = await this.genreModel.findById(_id);
		if (!genre) throw new NotFoundException(GenreErrorMessages.GENRE_NOT_FOUND);
		return genre;
	}

	async createGenre(dto: CreateGenreDto): Promise<DocumentType<GenreModel>> {
		const findGenre = await this.genreModel.findOne({ title: dto.title });
		if (findGenre) throw new ConflictException(GenreErrorMessages.GENRE_ALREADY_REGISTERED);
		return await this.genreModel.create(dto);
	}

	async updateGenre(_id: string, dto: UpdateGenreDto): Promise<DocumentType<GenreModel>> {
		if (Object.keys(dto).length === 0) {
			throw new BadRequestException(CommonErrorMessages.UPDATE_DTO_EMPTY);
		}

		const updatedGenre = await this.genreModel.findByIdAndUpdate(_id, dto, { new: true });
		if (!updatedGenre) throw new NotFoundException(GenreErrorMessages.GENRE_NOT_FOUND);
		return updatedGenre;
	}

	async deleteGenre(id: string): Promise<DocumentType<GenreModel>> {
		const deletedGenre = await this.genreModel.findByIdAndDelete(id);
		if (!deletedGenre) throw new NotFoundException(GenreErrorMessages.GENRE_NOT_FOUND);
		return deletedGenre;
	}
	// --------------- ADMIN cases ---------------
}
