<script>
	import { current_page } from '$lib/store.js';
	import { render } from 'svelte/server';
	// export let this_page,
	const { page_number, change_page, disabled } = $props();
</script>

<button
	class={`border-[1px] border-gray-500 px-4 py-2 mr-2 mb-4 ${disabled ? 'text-gray-800' : 'text-red-700 hover:underline'} font-semibold`}
	disabled={disabled ?? false}
	onclick={change_page}
>
	{page_number}
</button>
