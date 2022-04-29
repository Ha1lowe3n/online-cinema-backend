import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { CommonErrorMessages } from '../utils/error-messages/common-error-messages';
import { ActorErrorMessages } from '../utils/error-messages/actor-error.messages';
import { ActorModel } from './actor.model';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Injectable()
export class ActorService {
	constructor(@InjectModel(ActorModel) private readonly actorModel: ModelType<ActorModel>) {}

	async getActorBySlug(slug: string): Promise<DocumentType<ActorModel>> {
		const findActor = await this.actorModel.findOne({ slug });
		if (!findActor) throw new NotFoundException(ActorErrorMessages.ACTOR_NOT_FOUND);
		return findActor;
	}

	async findActors(searchTerm?: string): Promise<DocumentType<ActorModel>[]> {
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

		// !! ДОБАВИТЬ АГГРЕГАЦИИ ПОСЛЕ СОЗДАНИЯ СУЩНОСТИ ФИЛЬМА

		return await this.actorModel.find(options).select('-updatedAt -__v').sort({ createdAt: 1 });
	}

	// --------------- ADMIN cases ---------------
	async getActorById(_id: string): Promise<DocumentType<ActorModel>> {
		const actor = await this.actorModel.findById(_id);
		if (!actor) throw new NotFoundException(ActorErrorMessages.ACTOR_NOT_FOUND);
		return actor;
	}

	async createActor(dto: CreateActorDto): Promise<DocumentType<ActorModel>> {
		const findActorBySlug = await this.actorModel.findOne({ slug: dto.slug });
		if (findActorBySlug) {
			throw new ConflictException(ActorErrorMessages.ACTOR_ALREADY_REGISTERED_WITH_THIS_SLUG);
		}
		return await this.actorModel.create(dto);
	}

	async updateActor(_id: string, dto: UpdateActorDto): Promise<DocumentType<ActorModel>> {
		if (Object.keys(dto).length === 0) {
			throw new BadRequestException(CommonErrorMessages.UPDATE_DTO_EMPTY);
		}

		const updatedActor = await this.actorModel.findByIdAndUpdate(_id, dto, { new: true });
		if (!updatedActor) throw new NotFoundException(ActorErrorMessages.ACTOR_NOT_FOUND);
		return updatedActor;
	}

	async deleteActor(id: string): Promise<DocumentType<ActorModel>> {
		const deletedActor = await this.actorModel.findByIdAndDelete(id);
		if (!deletedActor) throw new NotFoundException(ActorErrorMessages.ACTOR_NOT_FOUND);
		return deletedActor;
	}
	// --------------- ADMIN cases ---------------
}
