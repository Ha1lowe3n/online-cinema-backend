import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose';

import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreModel } from './genre.model';
import { GenreService } from './genre.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { UpdateGenreDto } from './dto/update-genre.dto';
import {
	ApiCreateGenre,
	ApiDeleteGenre,
	ApiFindGenres,
	ApiGetGenreById,
	ApiGetGenreBySlug,
	ApiUpdateGenre,
} from './swagger/decorators';

@ApiTags('genre')
@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('by-slug/:slug')
	@ApiGetGenreBySlug()
	@AuthRoleGuard()
	async getGenreBySlug(@Param('slug') slug: string): Promise<DocumentType<GenreModel>> {
		return await this.genreService.getGenreBySlug(slug);
	}

	@Get(':id')
	@ApiGetGenreById()
	@AuthRoleGuard('admin')
	async getGenreById(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<GenreModel>> {
		return await this.genreService.getGenreById(id);
	}

	@Get()
	@ApiFindGenres()
	async findGenres(
		@Query('searchTerm') searchTerm?: string,
	): Promise<DocumentType<GenreModel>[]> {
		return await this.genreService.findGenres(searchTerm);
	}

	@Post('create')
	@ApiCreateGenre()
	@AuthRoleGuard('admin')
	async createGenre(@Body() dto: CreateGenreDto): Promise<DocumentType<GenreModel>> {
		return await this.genreService.createGenre(dto);
	}

	@Patch(':id')
	@ApiUpdateGenre()
	@AuthRoleGuard('admin')
	@HttpCode(200)
	async updateGenre(
		@Param('id', IdValidationPipe) _id: string,
		@Body() dto: UpdateGenreDto,
	): Promise<DocumentType<GenreModel>> {
		return await this.genreService.updateGenre(_id, dto);
	}

	@Delete(':id')
	@ApiDeleteGenre()
	@AuthRoleGuard('admin')
	async deleteGenre(
		@Param('id', IdValidationPipe) _id: string,
	): Promise<DocumentType<GenreModel>> {
		return await this.genreService.deleteGenre(_id);
	}
}
