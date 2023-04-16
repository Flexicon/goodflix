<script lang="ts">
	import '../app.css';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';

	export let data: LayoutData;

	let loading = false;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			// Workaround for automatic goto not working without setTimeout.
			switch (event) {
				case 'SIGNED_IN':
					setTimeout(() => goto('/'), 0);
					break;
				case 'SIGNED_OUT':
					setTimeout(() => goto('/login'), 0);
					break;
			}
		});

		return () => data.subscription.unsubscribe();
	});

	function handleSignout() {
		loading = true;
		return async ({ result }: { result: ActionResult }) => {
			// Workaround for automatic goto not working without setTimeout.
			if (result.type === 'redirect') {
				setTimeout(() => goto(result.location), 0);
			}
			loading = false;
		};
	}
</script>

<svelte:head>
	<title>GoodFlix</title>
</svelte:head>

<div class="mx-auto w-[1200px] max-w-full transition-opacity duration-700 opacity-100">
	<div class="p-6">
		<div class="mb-5 flex justify-between">
			<h1 class="text-3xl font-bold">🍿 GoodFlix</h1>

			<div>
				{#if session}
					<form method="post" action="?/signout" use:enhance={handleSignout}>
						<div>
							<button class="button block" disabled={loading}>Sign Out</button>
						</div>
					</form>
				{/if}
			</div>
		</div>

		<slot />
	</div>

	<footer class="p-6 text-center text-xs text-gray-500">Powered by ☕️ and 🍕</footer>
</div>
