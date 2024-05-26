<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, SubmitFunction } from './$types';

	export let data: PageData;

	let submitting = false;

	$: ({ profile, setupNeeded } = data);

	const handleSubmit: SubmitFunction = () => {
		submitting = true;

		return async ({ update }) => {
			await update({ reset: false });
			submitting = false;
		};
	};

	const handleAccountClose = () => {
		confirm('Close your account? This operation is irreversible.');
	};
</script>

<div class="sm:w-3/4 md:w-2/3 lg:w-1/2 m-auto my-12">
	<h1 class="text-xl font-bold mb-6">Your Profile</h1>

	<div>
		<span class="label">Email:</span>
		<span>{profile.email}</span>
	</div>

	<form method="post" use:enhance={handleSubmit}>
		<label for="username">Display Name</label>
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="form-input"
			type="text"
			name="username"
			id="username"
			placeholder="Displayed to others when sharing"
			value={profile.username}
			autofocus={setupNeeded}
			disabled={submitting}
			required
		/>

		<div class="flex justify-between">
			<button type="submit" class="button">💾 Save</button>
			<button
				type="button"
				class="button delete transition-opacity opacity-30 hover:opacity-100"
				on:click={handleAccountClose}>Close Account</button
			>
		</div>
	</form>
</div>

<style lang="postcss">
	label,
	.label {
		@apply inline-block text-gray-800 text-sm font-bold mb-2;
	}

	.form-input {
		@apply mb-5;
	}

	.button.delete {
		@apply bg-transparent text-red-600 hover:bg-red-600 hover:text-white border border-red-600;
	}
</style>
