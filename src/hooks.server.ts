import { env } from '$env/dynamic/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { DataStore, MoviesApi } from '$lib/server';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { createClient } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/ping') {
		return new Response('pong');
	}

	const supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});
	const adminSupabaseApi = createClient(PUBLIC_SUPABASE_URL, env.ADMIN_SUPABASE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}).auth.admin;
	event.locals.supabase = supabase;

	/**
	 * A convenience helper so we can just call
	 * await getSession() instead of const { data: { session } } = await supabase.auth.getSession()
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	/**
	 * Inject global services as locals.
	 */
	event.locals.moviesApi = new MoviesApi(env.TMDB_API_KEY);
	event.locals.dataStore = new DataStore(supabase, adminSupabaseApi, event.locals.getSession);

	return resolve(event, {
		/**
		 * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
		 *
		 * https://github.com/sveltejs/kit/issues/8061
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
