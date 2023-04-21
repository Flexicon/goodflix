<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ query, results, error } = data);
</script>

<h1>Search</h1>

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
