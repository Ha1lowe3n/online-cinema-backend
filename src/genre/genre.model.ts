import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface GenreModel extends Base {}
export class GenreModel extends TimeStamps {
	@prop({ unique: true, required: true })
	title: string;

	@prop({ unique: true, default: '' })
	slug?: string;

	@prop({ default: '' })
	description?: string;

	@prop({ default: '' })
	icon?: string;
}
