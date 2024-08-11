<script>
	/**
	 * @typedef {Object} Popup200Props
	 * @property {import('svelte').Snippet} children
	 */

	/**@type {Popup200Props}*/
	const { children } = $props();
</script>

<div
	class="w-full h-full fixed top-0 backdrop-brightness-50 flex flex-col items-center justify-center z-10"
>
	<div
		class="bg-white rounded-md w-full max-w-[400px] p-6 flex flex-col space-y-6 items-center text-center"
	>
		<div>{@render children()}</div>
		<a class="w-fit bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700" href="/">
			Return home
		</a>
	</div>
</div>
