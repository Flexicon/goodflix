// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { DataStore, MoviesApi } from '$lib/server';
import { SupabaseClient, type Session, type User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			supabaseAdmin: SupabaseClient;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
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
