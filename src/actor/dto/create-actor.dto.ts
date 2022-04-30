import { IsNotEmpty, IsString } from 'class-validator';
import { ActorErrorMessages } from '../../utils/error-messages/actor-error-messages';

export class CreateActorDto {
	@IsString({ message: ActorErrorMessages.ACTOR_NAME_SHOULD_BE_STRING })
	@IsNotEmpty({ message: ActorErrorMessages.ACTOR_NAME_CANT_BE_EMPTY })
	name: string;

	@IsString({ message: ActorErrorMessages.ACTOR_SLUG_SHOULD_BE_STRING })
	@IsNotEmpty({ message: ActorErrorMessages.ACTOR_SLUG_CANT_BE_EMPTY })
	slug: string;

	@IsString({ message: ActorErrorMessages.ACTOR_PHOTO_SHOULD_BE_STRING })
	@IsNotEmpty({ message: ActorErrorMessages.ACTOR_PHOTO_CANT_BE_EMPTY })
	photo: string;
}
