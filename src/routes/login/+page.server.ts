import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, depends, locals: { getSession } }) => {
	depends('supabase:auth');

	const session = await getSession();

	// if the user is already logged in return them to the account page
	if (session) {
		throw redirect(303, '/');
	}

	return { url: url.origin };
};
