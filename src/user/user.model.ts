import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string;

	@prop()
	passwordHash: string;

	@prop({ default: false })
	isAdmin: boolean;

	@prop({ type: () => String, _id: false, default: [] })
	favoritesMovies?: string[];
}
