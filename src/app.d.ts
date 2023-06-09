// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { DataStore, MoviesApi } from '$lib/server';
import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
			moviesApi: MoviesApi;
			dataStore: DataStore;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
