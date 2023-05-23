<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ session, moviesWatched, moviesToBeWatched } = data);
	$: user = { id: session?.user.id };
</script>

<p>home...</p>

<pre class="my-6 text-xs">{JSON.stringify(user, undefined, 2)}</pre>

<div class="grid grid-cols-3 gap-4">
	<div>
		<strong>Watched Movies:</strong>
		<pre class="mb-6 text-xs overflow-auto">{JSON.stringify(moviesWatched, undefined, 2)}</pre>
	</div>

	<div>
		<strong>To Be Watched Movies:</strong>
		<pre class="mb-6 text-xs overflow-auto">{JSON.stringify(moviesToBeWatched, undefined, 2)}</pre>
	</div>
</div>
