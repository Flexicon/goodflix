import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	// if the user is already logged in return them to the account page
	if (!session && !['/login', '/logging-in'].includes(url.pathname)) {
		throw redirect(303, '/login');
	}

	return {
		session
	};
};
