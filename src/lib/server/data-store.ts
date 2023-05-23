import type { SupabaseClient } from '@supabase/supabase-js';

export class DataStore {
	constructor(private supabase: SupabaseClient) {}

	async watchedMovies() {
		return await this.supabase
			.from('movies')
			.select('*, watched!inner (id, user_id)')
			.then((response) => response.data);
	}

	async toBeWatchedMovies() {
		return await this.supabase
			.from('movies')
			.select('*, to_be_watched!inner (id, user_id)')
			.then((response) => response.data);
	}
}
