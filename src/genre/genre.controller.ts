import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';
import {
	SuccessReturnGenreSwagger,
	BadRequestCreateGenreSwagger,
	ConflictCreateGenreSwagger,
	NotFoundGenreBySlugSwagger,
} from './swagger';

@ApiTags('genre')
@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'get genre by slug' })
	@ApiOkResponse({ description: 'get genre by slug', type: SuccessReturnGenreSwagger })
	@ApiNotFoundResponse({
		description: 'genre by slug not found',
		type: NotFoundGenreBySlugSwagger,
	})
	@Get('by-slug/:slug')
	@AuthRoleGuard()
	async getGenreBySlug(@Param('slug') slug: string) {
		return await this.genreService.getGenreBySlug(slug);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] create genre',
		description: 'only admin can update user role',
	})
	@ApiCreatedResponse({ description: 'success - create genre', type: SuccessReturnGenreSwagger })
	@ApiBadRequestResponse({
		description: 'bad request - error validate dto',
		type: BadRequestCreateGenreSwagger,
	})
	@ApiConflictResponse({
		description: 'conflict - genre already registered',
		type: ConflictCreateGenreSwagger,
	})
	@Post('create')
	@AuthRoleGuard('admin')
	async createGenre(@Body() dto: CreateGenreDto) {
		console.log(dto);
		return await this.genreService.createGenre(dto);
	}
}
