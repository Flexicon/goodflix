<script lang="ts">
	import SearchIcon from '$lib/components/SearchIcon.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ query, results, error } = data);
</script>

<h1 class="text-xl font-bold">Watch anything good recently?</h1>

<form class="w-1/2 m-auto my-12 flex items-center gap-1">
	<input type="text" name="q" id="query" required value={query} class="form-input" />
	<button class="button">
		<SearchIcon />
	</button>
</form>

{#if query}
	<p>Results for: {query}</p>
{/if}

{#if error}
	<pre>Error: {error}</pre>
{/if}

{#if !error}
	<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
		{#each results as result}
			<div class="">
				<div class="movie-poster">
					{#if result.poster_path}
						<img
							class="w-full h-full object-cover"
							src={result.poster_path}
							alt={`${result.title} poster`}
						/>
					{:else}
						<span class="text-gray-400 text-center">no image</span>
					{/if}
				</div>
				<div>
					{result.title}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="postcss">
	.movie-poster {
		@apply w-full flex flex-col justify-center bg-blue-50;

		aspect-ratio: 2/3;
	}
</style>
