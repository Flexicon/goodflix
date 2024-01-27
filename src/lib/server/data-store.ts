import type {
	GoTrueAdminApi,
	PostgrestResponse,
	Session,
	SupabaseClient
} from '@supabase/supabase-js';

type SessionGetter = () => Promise<Session | null>;

export class DataStore {
	constructor(
		private supabase: SupabaseClient,
		private admin: GoTrueAdminApi,
		private getSession: SessionGetter
	) {}

	async watchedMovies(): Promise<ListedMovie[]> {
		return await this.supabase
			.from('movies')
			.select('*, watchers:watched!inner (id, user_id)')
			.then(this.handleDBError)
			.then((response) => response.data as ListedMovie[]);
	}

	async toBeWatchedMovies(): Promise<ListedMovie[]> {
		return await this.supabase
			.from('movies')
			.select('*, watchers:to_be_watched!inner (id, user_id)')
			.then(this.handleDBError)
			.then((response) => response.data as ListedMovie[]);
	}

	/**
	 * Fetches user names and sets them for respective users nested under the given movie lists in place.
	 *
	 * Sets 'You' as the name for the currently authenticated user.
	 */
	async enhanceUsersInMovieLists(...movieLists: ListedMovie[][]) {
		const movies = movieLists.flat();
		const userNamesMap = await this.userNamesForList(movies);

		const userID = await this.getSession().then((s) => s?.user.id);
		const getDisplayName = (id: string) => (id === userID ? 'You' : userNamesMap[id]);

		for (const movie of movies) {
			for (const watcher of movie.watchers) {
				watcher.user_name = getDisplayName(watcher.user_id);
			}
		}

		return movieLists;
	}

	private async userNamesForList(movies: ListedMovie[]) {
		const userIDs = movies.map((movie) => movie.watchers.map((w) => w.user_id)).flat();
		return await this.userNames([...new Set(userIDs)]);
	}

	private async userNames(ids: string[]): Promise<Record<string, string>> {
		const users = await this.usersByIDs(ids);
		const map = Object.fromEntries(ids.map((id) => [id, 'Unknown']));

		for (const user of users) {
			if (user.email) {
				map[user.id] = user.email.split('@')[0];
			}
		}
		return map;
	}

	private async usersByIDs(ids: string[]) {
		return await this.admin
			.listUsers({ perPage: 100 })
			.then((response) => response.data.users.filter((user) => ids.includes(user.id)));
	}

	private handleDBError<T extends PostgrestResponse<unknown>>(response: T): T {
		if (response.error) {
			console.error(response.error);
			throw new Error(response.error.message);
		}
		return response;
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

export interface ListedMovie extends StoredMovie {
	watchers: {
		id: number;
		user_id: string;
		user_name?: string;
	}[];
}
