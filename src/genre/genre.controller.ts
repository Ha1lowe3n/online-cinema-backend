import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose';
import { UnauthorizedSwagger } from '../user/swagger';
import { AuthErrorMessages } from '../utils/error-messages/auth-error-messages';
import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreModel } from './genre.model';
import { GenreService } from './genre.service';
import {
	SuccessReturnGenreSwagger,
	BadRequestCreateGenreSwagger,
	ConflictCreateGenreSwagger,
	NotFoundGenreSwagger,
	BadRequestUpdateGenreSwagger,
} from './swagger';
import { ForbiddenSwagger } from '../swagger/403-forbidden.swagger';
import { GenreErrorMessages } from '../utils/error-messages/genre-error-messages';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CommonErrorMessages } from '../utils/error-messages/common-error-messages';
import { BadRequestInvalidIdSwagger } from '../swagger/400-invalid-id.swagger';
import { UpdateGenreDto } from './dto/update-genre.dto';

@ApiTags('genre')
@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'get genre by slug' })
	@ApiOkResponse({ description: 'get genre by slug', type: SuccessReturnGenreSwagger })
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiNotFoundResponse({
		description: GenreErrorMessages.GENRE_NOT_FOUND,
		type: NotFoundGenreSwagger,
	})
	@Get('by-slug/:slug')
	@AuthRoleGuard()
	async getGenreBySlug(@Param('slug') slug: string): Promise<DocumentType<GenreModel>> {
		return await this.genreService.getGenreBySlug(slug);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: '[ADMIN] get genre by genre id' })
	@ApiOkResponse({ description: 'get genre by genre id', type: SuccessReturnGenreSwagger })
	@ApiBadRequestResponse({
		description: CommonErrorMessages.ID_INVALID,
		type: BadRequestInvalidIdSwagger,
	})
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger })
	@ApiNotFoundResponse({
		description: GenreErrorMessages.GENRE_NOT_FOUND,
		type: NotFoundGenreSwagger,
	})
	@Get(':id')
	@AuthRoleGuard('admin')
	async getGenreById(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<GenreModel>> {
		return await this.genreService.getGenreById(id);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'get all genres or genre by searchTerm' })
	@ApiQuery({ name: 'searchTerm', required: false })
	@ApiOkResponse({
		description: 'get genre by slug',
		type: SuccessReturnGenreSwagger,
		isArray: true,
	})
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@Get()
	@AuthRoleGuard()
	async findGenres(
		@Query('searchTerm') searchTerm?: string,
	): Promise<DocumentType<GenreModel>[]> {
		return await this.genreService.findGenres(searchTerm);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] create genre',
		description: 'only admin can create genre',
	})
	@ApiCreatedResponse({ description: 'success - create genre', type: SuccessReturnGenreSwagger })
	@ApiBadRequestResponse({
		description: 'bad request - error validate dto',
		type: BadRequestCreateGenreSwagger,
	})
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiConflictResponse({
		description: 'conflict - genre already registered',
		type: ConflictCreateGenreSwagger,
	})
	@ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger })
	@Post('create')
	@AuthRoleGuard('admin')
	async createGenre(@Body() dto: CreateGenreDto): Promise<DocumentType<GenreModel>> {
		return await this.genreService.createGenre(dto);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] update genre',
		description: 'only admin can update genre',
	})
	@ApiBody({ type: CreateGenreDto })
	@ApiOkResponse({ description: 'success - create genre', type: SuccessReturnGenreSwagger })
	@ApiBadRequestResponse({
		description: 'bad request - error validate dto or genre id',
		type: BadRequestUpdateGenreSwagger,
	})
	@ApiUnauthorizedResponse({
		description: AuthErrorMessages.UNAUTHORIZED,
		type: UnauthorizedSwagger,
	})
	@ApiForbiddenResponse({ description: AuthErrorMessages.FORBIDDEN, type: ForbiddenSwagger })
	@Patch('update/:id')
	@AuthRoleGuard('admin')
	@HttpCode(200)
	async updateGenre(
		@Param('id', IdValidationPipe) _id: string,
		@Body() dto: UpdateGenreDto,
	): Promise<DocumentType<GenreModel>> {
		return await this.genreService.updateGenre(_id, dto);
	}
}
