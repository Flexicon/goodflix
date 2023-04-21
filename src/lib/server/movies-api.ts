import type { Movie, MovieSearchResults } from '../types/movie';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const cache: Record<string, unknown> = {};

export interface ApiResults<T> {
	data?: T;
	error?: ApiError;
}

export interface ApiError {
	status_message: string;
	status_code: number;
}

export class MoviesApi {
	constructor(private apiKey: string) {}

	async getMovie(id: number): Promise<ApiResults<Movie>> {
		const result = await this.get<Movie>(`${API_BASE_URL}/movie/${id}`);
		if (result.data) {
			result.data = this.prepareMovie(result.data);
		}

		return result;
	}

	async search(query: string): Promise<ApiResults<MovieSearchResults>> {
		const params = new URLSearchParams({ query });
		const result = await this.get<MovieSearchResults>(`${API_BASE_URL}/search/movie?${params}`);
		if (result.data) {
			result.data = {
				...result.data,
				results: result.data.results.map(this.prepareMovie.bind(this))
			};
		}

		return result;
	}

	private async get<T>(resource: string): Promise<ApiResults<T>> {
		if (resource in cache) {
			return { data: cache[resource] as T };
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

		cache[resource] = body;
		return { data: body };
	}

	private prepareMovie<T extends { poster_path: string | null; backdrop_path: string | null }>(
		movie: T
	): T {
		return {
			...movie,
			poster_path: this.prepareImageUrl(movie.poster_path),
			backdrop_path: this.prepareImageUrl(movie.backdrop_path)
		};
	}

	private prepareImageUrl(imagePath: string | null): string | null {
		return imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null;
	}
}
