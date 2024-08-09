<script>
	/**
	 * @typedef {Object} ButtonProps
	 * @property {"button" | "submit" | "reset" | null | undefined} type
	 * @property {string} className
	 * @property {boolean} [isPending]
	 * @property {import('svelte').Snippet} children
	*/

	import Loader from './icons/Loader.svelte';

	/**@type {ButtonProps}*/
	const { type, className, isPending, children } = $props()
</script>

<button
	type={type}
	class={className}
	disabled={isPending}
>
	{#if isPending}
		<div class="flex justify-center items-center space-x-4">
			<Loader size="22"/>
			<p>Loading</p>
		</div>
	{:else}
		{@render children()}
	{/if}
</button>