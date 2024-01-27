import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const email = url.searchParams.get('email')?.trim() ?? '';
	console.log("Share current user's lists with:", email, 'if it exists.');

	return {};
};
