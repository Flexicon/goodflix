<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="mx-auto w-[500px] max-w-full pt-5">
	<Auth supabaseClient={data.supabase} appearance={{ theme: ThemeSupa }} magicLink />
</div>
