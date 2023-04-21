<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ query, results, error } = data);
</script>

<h1 class="text-xl font-bold">Watch anything good recently?</h1>

<form class="w-1/2 m-auto my-12 flex items-center gap-1">
	<input type="text" name="q" id="query" required value={query} class="form-input" />
	<button class="button">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
			/>
		</svg>
	</button>
</form>

{#if query}
	<p>Results for: {query}</p>
{/if}

{#if error}
	<pre>Error: {error}</pre>
{/if}

{#if !error}
	<ul class="list-disc list-inside mt-5 ms-5">
		{#each results as result}
			<li>{result.title}</li>
		{/each}
	</ul>
{/if}
