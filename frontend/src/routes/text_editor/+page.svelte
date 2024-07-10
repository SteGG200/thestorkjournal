<script>
	import { browser } from '$app/environment';
	import Editor from '$lib/editor.svelte';

	import '../../app.css';
	import Navbar from '../../lib/navbar.svelte';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import Popup from '$lib/popup.svelte';
	import { on } from 'svelte/events';

	const tags = [
		'News',
		'Politics',
		'Economies',
		'Science',
		'Entertainment',
		'Sport',
		'Art gallery',
		'About'
	];
	let onmessage = $state(false);
	let title = $state();
	let message = $state();
	let category = $state();
    let editor = $state();

	$effect(() => {
		const loadEditor = async () => {
			const ImageTool = (await import('@editorjs/image')).default;
			editor = new (await import('@editorjs/editorjs')).default({
				autofocus: true,
				placeholder: 'Article Content',
				tools: {
					image: {
						//@ts-ignore
						class: ImageTool,
						config: {
							endpoints: {
								byFile: `${PUBLIC_SERVER_URL}/upload`,
								byUrl: `${PUBLIC_SERVER_URL}`
							}
						}
					}
				}
			});

			
		};
		loadEditor();
	});

	function check_submit() {
		if (title.length < 10) {
			message = 'Title must contain at least 10 characters.';
			onmessage = true;
		}
	}

	async function submit() {
        try {
            console.log('Article data: ', await editor.save());
        } catch (err) {
            console.log('Article error: ', err);
        }
    }
</script>

{#if onmessage}
	<Popup />
{/if}
<Navbar />
<div class="flex pb-10 pt-24">
	<input
		bind:value={title}
		class="font-bold text-3xl w-3/4 text-center outline-none mx-auto"
		placeholder="Article title"
	/>
</div>
<div id="editorjs" class="text-xl" placeholder="Article content"></div>
<div class="w-full flex items-center justify-center space-x-6">
	<select
		bind:value={category}
		class=" bg-gray-50 border text-gray-900 text-sm rounded-md border-red-500 focus:ring-red-500 focus:border-red-500 block p-2.5"
	>
		<option value="category">Category</option>
		{#each tags as tag}
			<option value={tag}>{tag}</option>
		{/each}
	</select>
	<button
		type="button"
		onclick={submit}
		class=" text-gray-700 border border-red-500 hover:bg-primary-700
         font-medium rounded-md text-sm px-5 py-2.5 text-center">Add Thumbnail</button
	>
	<button
		type="button"
		onclick={submit}
		class=" text-gray-100 bg-red-500 hover:bg-primary-600 border-2 border-red-500
        focus:ring-2 focus:outline-none focus:ring-red-700 focus:ring-primary-300
        font-medium rounded-md text-sm px-5 py-2.5 text-center" >Submit your article</button
	>
</div>
