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
    let onimage = $state(true);
    let image,thumbnail_src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";
    

	$effect(() => {
		const loadEditor = async () => {
			const ImageTool = (await import('@editorjs/image')).default;
			editor = new (await import('@editorjs/editorjs')).default({
				autofocus: true,
				placeholder: 'Article Content',
				tools: {
					image: {
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

    async function send_thumbnail(e){
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("thumbnail", file)
        const response = await fetch(`${PUBLIC_SERVER_URL}/upload`,{
            method: 'POST',
            body: formData
        })

        const result = await response.json()
        if (response.status != 200){
            alert("NO");
        }else{
            console.log(result);
            thumbnail_src = result.file.url;
            onimage=true;
        }

        
    }

    function upload_thumbnail(){
        console.log("ok");
        image.click();
    }

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
<div class="flex flex-col items-center justify-center mb-10 pt-24">
	<input
		bind:value={title}
		class="font-bold text-3xl w-3/4 text-center outline-none mx-auto mb-4" 
		placeholder="Article title"
	/>
    
    {#if onimage}
        <div class="text-center"> 
            <img class="w-full mx-4 sm:w-[650px] hover:blur-sm" src={thumbnail_src} alt="your_thumbnail" onclick={upload_thumbnail}>
            <div class="w-full h-full">
                <div class="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2 text-gray-200">Change thumbnail</div>
            </div>
        </div>
    {:else}
        <div class="flex flex-col items-center border border-gray-500 w-full mx-4 sm:w-[650px] h-80 rounded-lg pt-28">
            <img alt="icon_img" class="w-16 h-16" src="https://icones.pro/wp-content/uploads/2021/08/icone-photo-grise.png" onclick={upload_thumbnail}>
            <button class="text-gray-500 border-none hover:font-semibold " onclick={upload_thumbnail} >Upload Thumbnail</button>
        </div>
    {/if}
    <input class="hidden" type="file" accept=".jpg, .jpeg, .png" bind:this={image} onchange={(e) => { send_thumbnail(e)}}>
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
