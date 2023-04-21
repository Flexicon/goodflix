<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
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

		return async ({ update }) => {
			await update();
			signingOut = false;
		};
	};
</script>

<svelte:head>
	<title>GoodFlix</title>
</svelte:head>

<div class="mx-auto w-[1200px] max-w-full transition-opacity duration-700 opacity-100">
	<div class="p-6">
		<div class="mb-5 flex justify-between">
			<h1 class="text-3xl font-bold">
				<a href="/">🍿 GoodFlix</a>
			</h1>

			<div class="flex items-center gap-2">
				{#if session}
					<a
						href="/search"
						class="button primary link"
						aria-current={$page.url.pathname === '/search'}
					>
						🎬 Add Movie
					</a>
					<form method="post" action="/?/signout" use:enhance={handleSignout}>
						<button class="button" disabled={signingOut}>
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
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
								/>
							</svg>
							<span>Sign Out</span>
						</button>
					</form>
				{/if}
			</div>
		</div>

		<slot />
	</div>

	<footer class="p-6 text-center text-xs text-gray-500">Powered by ☕️ and 🍕</footer>
</div>

<style lang="postcss">
	.link[aria-current='true']:not(:hover) {
		@apply bg-yellow-200;
	}
</style>
