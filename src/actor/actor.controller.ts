import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { AuthRoleGuard } from '../auth/decorators/auth-role.decorator';
import { ActorModel } from './actor.model';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Controller('actor')
@ApiTags('actor')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Get('by-slug/:slug')
	@AuthRoleGuard()
	async getActorBySlug(@Param('slug') slug: string): Promise<DocumentType<ActorModel>> {
		return await this.actorService.getActorBySlug(slug);
	}

	@Get(':id')
	@AuthRoleGuard('admin')
	async getActorById(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<ActorModel>> {
		return await this.actorService.getActorById(id);
	}

	@Get()
	async findActors(
		@Query('searchTerm') searchTerm?: string,
	): Promise<DocumentType<ActorModel>[]> {
		return await this.actorService.findActors(searchTerm);
	}

	@Post('create')
	@AuthRoleGuard('admin')
	async createGenre(@Body() dto: CreateActorDto): Promise<DocumentType<ActorModel>> {
		return await this.actorService.createActor(dto);
	}

	@Patch(':id')
	@AuthRoleGuard('admin')
	@HttpCode(200)
	async updateGenre(
		@Param('id', IdValidationPipe) _id: string,
		@Body() dto: UpdateActorDto,
	): Promise<DocumentType<ActorModel>> {
		return await this.actorService.updateActor(_id, dto);
	}

	@Delete(':id')
	@AuthRoleGuard('admin')
	async deleteGenre(
		@Param('id', IdValidationPipe) _id: string,
	): Promise<DocumentType<ActorModel>> {
		return await this.actorService.deleteActor(_id);
	}
}
