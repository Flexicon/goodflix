import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return { meta: { title: 'Login Error' } };
};
