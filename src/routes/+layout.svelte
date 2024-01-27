<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SignOutIcon from '$lib/components/SignOutIcon.svelte';
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
		<div class="mb-5 flex justify-between items-center">
			<h1 class="text-xl sm:text-2xl md:text-3xl font-bold">
				<a href="/">🍿 GoodFlix</a>
			</h1>

			<div class="flex items-center gap-2 text-xs sm:text-base">
				{#if session}
					<a
						href="/search"
						class="button primary link"
						aria-current={$page.url.pathname === '/search'}
					>
						🎬 Movies
					</a>
					<form method="post" action="/?/signout" use:enhance={handleSignout}>
						<button class="button" disabled={signingOut}>
							<SignOutIcon />
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
		@apply bg-amber-300;
	}
</style>
