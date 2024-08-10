<script>
	/**
	 * @typedef {Object} Popup401Props
	 * @property {string} redirect
	 * @property {string} buttonText
	 * @property {import('svelte').Snippet} children
	 */

	/**@type {Popup401Props}*/
	const { redirect, buttonText, children } = $props();
</script>

<div
	class="w-full h-full fixed top-0 backdrop-brightness-50 flex flex-col items-center justify-center z-10"
>
	<div class="p-6 flex flex-col items-center space-y-6 bg-white rounded-md w-full max-w-[300px] text-center">
		<div>{@render children()}</div>
		<a
			class="w-fit bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
			href={`/login?redirect=${redirect}`}
		>
			{buttonText}
		</a>
	</div>
</div>
