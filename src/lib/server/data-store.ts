import type { PostgrestSingleResponse, SupabaseClient, User } from '@supabase/supabase-js';

type AuthedUserGetter = () => Promise<User | null>;

export class DataStore {
	constructor(
		private supabase: SupabaseClient,
		private getUser: AuthedUserGetter
	) {}

	async userProfile(): Promise<UserProfile> {
		const { data: profile } = await this.supabase
			.from('profiles')
			.select('id, username, email')
			.single();

		if (!profile) throw new Error('Profile not found for current user');

		return profile;
	}

	async updateUsername(username: string): Promise<void> {
		const { id } = await this.userProfile();
		await this.supabase.from('profiles').update({ username }).eq('id', id).then(this.handleDBError);
	}

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

	private handleDBError<T extends PostgrestSingleResponse<unknown>>(response: T): T {
		if (response.error) {
			console.error(response.error);
			throw new Error(response.error.message);
		}
		return response;
	}

	private async mapMoviesToListed(movies: MovieQueryRecord[]): Promise<ListedMovie[]> {
		const user = await this.getUser();

		return movies.map((m) => {
			const { watchers, ...movie } = m;

			return {
				...movie,
				watchers: watchers.map((w) => ({
					isCurrentUser: w.user_id === user?.id,
					username: w.profile.username ?? 'Unknown'
				}))
			};
		});
	}
}

export interface UserProfile {
	id: string;
	username: string;
	email: string;
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
		profile: Pick<UserProfile, 'username'>;
	}[];
}

export interface ListedMovie extends StoredMovie {
	watchers: {
		isCurrentUser: boolean;
		username: string;
	}[];
}
