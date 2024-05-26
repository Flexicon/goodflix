import { env } from '$env/dynamic/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { DataStore, MoviesApi } from '$lib/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});
	event.locals.supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, env.ADMIN_SUPABASE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	/**
	 * Inject global services as locals.
	 */
	event.locals.moviesApi = new MoviesApi(env.TMDB_API_KEY);
	event.locals.dataStore = new DataStore(event.locals.supabase, event.locals.safeGetSession);

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (
		!event.locals.session &&
		!['/auth', '/api/auth'].some((prefix) => event.url.pathname.startsWith(prefix))
	) {
		return redirect(303, '/auth');
	}

	if (event.locals.session && event.url.pathname === '/auth') {
		return redirect(303, '/');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
