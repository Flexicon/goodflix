<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import SearchIcon from '$lib/components/SearchIcon.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let selectedMovieID: number | null = null;

	$: ({ query, results, error, headerTitle, searchPlaceholder } = data);
	$: movieSelected = !!selectedMovieID;

	const formatDate = (date: string): string =>
		new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date));

	const onSelectMovie = (id: number) => () => {
		selectedMovieID = id;
	};
	const onCloseModal = () => {
		selectedMovieID = null;
	};
</script>

<h1 class="text-xl font-bold">{headerTitle}</h1>

<form class="sm:w-3/4 md:w-2/3 lg:w-1/2 m-auto my-12 flex items-center gap-1">
	<input
		class="form-input"
		type="text"
		name="q"
		id="query"
		required
		value={query}
		placeholder={searchPlaceholder}
	/>
	<button class="button"><SearchIcon /></button>
</form>

{#if error}
	<pre class="py-5 text-red-500">Error: {error}</pre>
{/if}

<Modal showModal={movieSelected} noCloseButton on:close={onCloseModal}>
	<h3 slot="header" class="text-xl font-bold">Choose a list for this movie</h3>

	<div class="flex flex-col gap-2 pt-4 px-4 pb-2">
		<form class="flex flex-col" method="post" action="?/add-to-watched">
			<input type="hidden" name="movie_id" value={selectedMovieID} />
			<button class="button">Watched</button>
		</form>
		<form class="flex flex-col" method="post" action="?/add-to-to-watch">
			<button class="button">To watch</button>
		</form>
	</div>
</Modal>

<div class="flex flex-col gap-5">
	{#each results as result}
		<div
			class="movie-card"
			aria-selected={result.id === selectedMovieID}
			on:click={onSelectMovie(result.id)}
			on:keyup={onSelectMovie(result.id)}
		>
			<div class="movie-poster">
				{#if result.poster_path}
					<img
						class="w-full h-full object-cover"
						src={result.poster_path}
						alt={`${result.title} poster`}
						title={result.title}
					/>
				{:else}
					<span class="text-gray-400 text-center">no image</span>
				{/if}
			</div>
			<div class="py-3 px-4">
				<div class="mb-1 leading-tight font-medium text-lg line-clamp-2" title={result.title}>
					{result.title}
				</div>
				<div class="mb-4 text-gray-400 text-sm">
					{formatDate(result.release_date)}
				</div>
				<p class="line-clamp-3">{result.overview}</p>
			</div>
		</div>
	{/each}
</div>

{#if query && !results.length}
	<p class="italic text-gray-500 text-center">No results for <strong>{query}</strong>.</p>
{/if}

<style lang="postcss">
	.movie-card {
		@apply grid grid-cols-[minmax(120px,10%)_1fr];
		@apply bg-gray-50 border shadow-md rounded-md overflow-hidden;
		@apply transition-transform hover:scale-105 cursor-pointer;
	}

	.movie-card[aria-selected='true'] {
		@apply scale-105;
	}

	.movie-poster {
		@apply flex flex-col justify-center bg-white;

		aspect-ratio: 2/3;
	}
</style>
