import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { dataStore } }) => {
	const [moviesWatched, moviesToBeWatched] = await Promise.all([
		dataStore.watchedMovies(),
		dataStore.toBeWatchedMovies()
	]);

	return {
		moviesWatched,
		moviesToBeWatched
	};
};

export const actions = {
	signout: async ({ locals: { supabase, getUser } }) => {
		if (await getUser()) {
			await supabase.auth.signOut();
			redirect(303, '/login');
		}
	}
} satisfies Actions;
