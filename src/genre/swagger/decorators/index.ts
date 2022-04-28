import { ApiCreateGenre } from './create-genre.swagger.decorator';
import { ApiDeleteGenre } from './delete-genre.swagger.decorator';
import { ApiFindGenres } from './find-genres.swagger.decorator';
import { ApiGetGenreById } from './get-genre-by-id.swagger.decorator';
import { ApiGetGenreBySlug } from './get-genre-by-slug.swagger.decorator';
import { ApiUpdateGenre } from './update-genre.swagger.decorator';

export {
	ApiGetGenreBySlug,
	ApiGetGenreById,
	ApiFindGenres,
	ApiCreateGenre,
	ApiUpdateGenre,
	ApiDeleteGenre,
};
