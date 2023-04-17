<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData, SubmitFunction } from './$types';

	export let data: LayoutData;

	let signingOut = false;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const handleSignout: SubmitFunction = () => {
		signingOut = true;

		return ({ update }) => {
			signingOut = false;
			update();
		};
	};
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
					<form method="post" action="/?/signout" use:enhance={handleSignout}>
						<button
							class="button block p-2 rounded hover:bg-slate-200 disabled:opacity-30"
							disabled={signingOut}
						>
							Sign Out
						</button>
					</form>
				{/if}
			</div>
		</div>

		<slot />
	</div>

	<footer class="p-6 text-center text-xs text-gray-500">Powered by ☕️ and 🍕</footer>
</div>
