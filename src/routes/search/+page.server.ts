import type { MovieResult } from '$lib/types/movie';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { moviesApi } }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';

	let results: MovieResult[] = [];
	let error: string | null = null;

	if (query) {
		const { data, error: apiError } = await moviesApi.search(query);
		if (data) {
			results = data.results;
		} else {
			error = apiError?.status_message ?? 'Something went wrong.';
		}
	}

	return { results, query, error };
};
