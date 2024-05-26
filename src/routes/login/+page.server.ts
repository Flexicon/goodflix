import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, depends, locals: { getUser } }) => {
	depends('supabase:auth');

	// if the user is already logged in return them to the root page
	if (await getUser()) {
		redirect(303, '/');
	}

	return { url: url.origin };
};
