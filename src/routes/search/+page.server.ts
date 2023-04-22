import type { MovieResult } from '$lib/types/movie';
import type { PageServerLoad } from './$types';

const HEADER_TITLES = [
	'Watch anything good recently?',
	'Looking for your next binge?',
	'Picking out some classic flix?'
];
const SEARCH_PLACEHOLDERS = [
	'Fight Club',
	'Harry Potter and the Order of the Pheonix',
	'Love Actually',
	'Girl, Interrupted'
];

function pickRandom<T>(input: T[]): T {
	return input[Math.floor(Math.random() * input.length)];
}

export const load: PageServerLoad = async ({ url, locals: { moviesApi } }) => {
	const headerTitle = pickRandom(HEADER_TITLES);
	const searchPlaceholder = pickRandom(SEARCH_PLACEHOLDERS);

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

	return { results, query, error, headerTitle, searchPlaceholder };
};
