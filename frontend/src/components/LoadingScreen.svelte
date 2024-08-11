<script>
	/**
	 * @typedef {Object} LoadingScreenProps
	 * @property {string} [className]
	 */

	import Loader from './icons/Loader.svelte';

	/**@type {LoadingScreenProps}*/
	const { className } = $props();
</script>

<div
	class={`fixed ${className} bg-white w-full h-dvh flex justify-center items-center space-x-4 z-10`}
>
	<p class="text-xl sm:text-4xl">Loading</p>
	<Loader size="40" />
</div>
