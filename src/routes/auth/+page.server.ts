import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, depends }) => {
	depends('supabase:auth');

	return { url: url.origin, meta: { title: 'Login' } };
};
