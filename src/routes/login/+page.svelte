<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>GoodFlix - Login</title>
</svelte:head>

<div class="mx-auto w-[500px] max-w-full pt-5">
	<Auth
		supabaseClient={data.supabase}
		redirectTo={`${data.url}/logging-in?redirect=/`}
		appearance={{ theme: ThemeSupa }}
		magicLink
	/>
</div>
