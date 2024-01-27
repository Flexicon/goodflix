<script lang="ts">
	import SearchIcon from '$lib/components/SearchIcon.svelte';
</script>

<h1 class="text-xl font-bold">Share your movie lists</h1>

<form class="sm:w-3/4 md:w-2/3 lg:w-1/2 m-auto my-12 flex items-center gap-1">
	<input
		class="form-input"
		type="email"
		name="email"
		id="query"
		required
		placeholder="Email to share your lists with"
	/>
	<button class="button">Share</button>
</form>
