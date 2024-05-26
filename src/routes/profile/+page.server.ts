import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { dataStore } }) => {
	const profile = await dataStore.userProfile();
	const setupNeeded = url.searchParams.has('setup') && !profile.username;

	return { profile, setupNeeded };
};

export const actions = {
	default: async ({ locals: { dataStore }, request }) => {
		const data = await request.formData();
		const username = data.get('username');

		if (username && typeof username === 'string') {
			await dataStore.updateUsername(username);
		}
	}
} satisfies Actions;
