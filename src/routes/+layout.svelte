<script>
	import '../app.css';
</script>

<div class="mx-auto w-[1200px] max-w-full transition-opacity duration-700 opacity-100">
	<div class="p-6">
		<div class="mb-5 flex justify-between">
			<h1 class="text-3xl font-bold underline">GoodFlix</h1>
		</div>

		<slot />
	</div>

	<footer class="p-6 text-center text-xs text-gray-500">Powered by ☕️ and 🍕</footer>
</div>
