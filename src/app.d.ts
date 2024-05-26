// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { DataStore, MoviesApi } from '$lib/server';
import { SupabaseClient, Session, type User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			supabaseAdmin: SupabaseClient;
			getUser(): Promise<User | null>;
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
