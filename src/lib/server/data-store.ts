import type { PostgrestResponse, Session, SupabaseClient } from '@supabase/supabase-js';

type SessionGetter = () => Promise<Session | null>;

export class DataStore {
	constructor(private supabase: SupabaseClient, private getSession: SessionGetter) {}

	async watchedMovies(): Promise<ListedMovie[]> {
		return await this.supabase
			.from('movies')
			.select('*, watchers:watched!inner (id, user_id, profile:profiles(username))')
			.then(this.handleDBError)
			.then((response) => this.mapMoviesToListed(response.data as MovieQueryRecord[]));
	}

	async toBeWatchedMovies(): Promise<ListedMovie[]> {
		return await this.supabase
			.from('movies')
			.select('*, watchers:to_be_watched!inner (id, user_id, profile:profiles(username))')
			.then(this.handleDBError)
			.then((response) => this.mapMoviesToListed(response.data as MovieQueryRecord[]));
	}

	private handleDBError<T extends PostgrestResponse<unknown>>(response: T): T {
		if (response.error) {
			console.error(response.error);
			throw new Error(response.error.message);
		}
		return response;
	}

	private async mapMoviesToListed(movies: MovieQueryRecord[]): Promise<ListedMovie[]> {
		const session = await this.getSession();

		return movies.map((m) => {
			const { watchers, ...movie } = m;

			return {
				...movie,
				watchers: watchers.map((w) => ({
					isCurrentUser: w.user_id === session?.user.id,
					username: w.profile.username ?? 'Unknown'
				}))
			};
		});
	}
}

export interface StoredMovie {
	id: number;
	external_id: number;
	title: string;
	release_date: Date;
	overview: string;
	poster_url: string;
}

interface MovieQueryRecord extends StoredMovie {
	watchers: {
		user_id: string;
		profile: { username: string };
	}[];
}

export interface ListedMovie extends StoredMovie {
	watchers: {
		isCurrentUser: boolean;
		username: string;
	}[];
}
