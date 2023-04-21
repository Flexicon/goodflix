import type { Movie, MovieSearchResults } from '../types/movie';

const API_BASE_URL = 'https://api.themoviedb.org/3';

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
		return await this.get(`${API_BASE_URL}/movie/${id}`);
	}

	async search(query: string): Promise<ApiResults<MovieSearchResults>> {
		const params = new URLSearchParams({ query });
		return await this.get(`${API_BASE_URL}/search/movie?${params}`);
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
}
