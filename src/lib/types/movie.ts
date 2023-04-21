export interface Movie {
	backdrop_path: string | null;
	genres: Genre[];
	homepage: string | null;
	id: number;
	overview: string | null;
	poster_path: string | null;
	release_date: Date;
	status: string;
	tagline: string | null;
	title: string;
}

export interface Genre {
	id: number;
	name: string;
}
export interface MovieSearchResults {
	page: number;
	results: MovieResult[];
	total_results: number;
	total_pages: number;
}

export interface MovieResult {
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	overview: string | null;
	poster_path: string | null;
	release_date: Date;
	title: string;
}
