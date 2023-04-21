import type { Movie, MovieSearchResults } from '../types/movie';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const cache: Record<string, string> = {};

export interface ApiResult<T> {
	data?: T;
	error?: ApiError;
}

export interface ApiError {
	status_message: string;
	status_code: number;
}

interface ImagePaths {
	poster_path: string | null;
	backdrop_path: string | null;
}

export class MoviesApi {
	constructor(private apiKey: string) {}

	async getMovie(id: number): Promise<ApiResult<Movie>> {
		const result = await this.get<Movie>(`${API_BASE_URL}/movie/${id}`);
		if (result.data) {
			result.data = this.formatMovie(result.data);
		}

		return result;
	}

	async search(query: string): Promise<ApiResult<MovieSearchResults>> {
		const params = new URLSearchParams({ query });
		const result = await this.get<MovieSearchResults>(`${API_BASE_URL}/search/movie?${params}`);
		if (result.data) {
			result.data.results = this.formatMovies(result.data.results);
		}

		return result;
	}

	private async get<T>(resource: string): Promise<ApiResult<T>> {
		if (resource in cache) {
			return { data: JSON.parse(cache[resource]) as T };
		}

		const response = await fetch(resource, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`
			}
		});
		const body = await response.json();

		if (response.status !== 200) {
			return { error: body };
		}

		cache[resource] = JSON.stringify(body);
		return { data: body };
	}

	private formatMovie<T extends ImagePaths>(movie: T): T {
		return {
			...movie,
			poster_path: this.buildImageUrl(movie.poster_path),
			backdrop_path: this.buildImageUrl(movie.backdrop_path)
		};
	}

	private formatMovies<T extends ImagePaths>(movies: T[]): T[] {
		return movies.map(this.formatMovie.bind(this));
	}

	private buildImageUrl(imagePath: string | null): string | null {
		return imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null;
	}
}
