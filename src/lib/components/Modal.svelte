<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let showModal: boolean = false;
	export let closeButtonText: string = 'Close';
	export let noCloseButton: boolean = false;

	const dispatch = createEventDispatcher();

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => {
		showModal = false;
		dispatch('close');
	}}
	on:click|self={() => dialog.close()}
>
	<div on:click|stopPropagation>
		<slot name="header" />
		<hr />
		<slot />
		{#if !noCloseButton}
			<hr />
			<!-- svelte-ignore a11y-autofocus -->
			<button class="button" autofocus on:click={() => dialog.close()}>{closeButtonText}</button>
		{/if}
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
