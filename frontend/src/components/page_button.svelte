<script>
    import { current_page } from "$lib/store.js";
	import { render } from "svelte/server";
    // export let this_page,
    let { page_number,change_page } = $props();
    
</script>    

<button class="border-[1px] border-gray-500 px-4 py-2 mr-2 mb-4 text-red-700 font-semibold hover:underline"  onclick={change_page}>
{page_number}
</button >
