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

	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});
	event.locals.supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, env.ADMIN_SUPABASE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});

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
	 * A convenience helper so we can just call
	 * await getUser() instead of const { data: { user } } = await supabase.auth.getUser()
	 */
	event.locals.getUser = async () => {
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		return user;
	};

	/**
	 * Inject global services as locals.
	 */
	event.locals.moviesApi = new MoviesApi(env.TMDB_API_KEY);
	event.locals.dataStore = new DataStore(event.locals.supabase, event.locals.getSession);

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
