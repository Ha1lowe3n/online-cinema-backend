import { Body, Controller, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';
import {
	SuccessCreateGenreSwagger,
	BadRequestCreateGenreSwagger,
	ConflictCreateGenreSwagger,
} from './swagger';

@ApiTags('genre')
@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@ApiBearerAuth()
	@ApiOperation({
		summary: '[ADMIN] create genre',
		description: 'only admin can update user role',
	})
	@ApiCreatedResponse({ description: 'success - create genre', type: SuccessCreateGenreSwagger })
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
