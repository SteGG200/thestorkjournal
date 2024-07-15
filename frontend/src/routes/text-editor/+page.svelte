<script>
	import { browser } from '$app/environment';

	import '../../app.css';
	import Navbar from '../../subcomponent/navbar.svelte';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { on } from 'svelte/events';
    import Popup_200 from '../../subcomponent/popup_200.svelte';
    import Popup_401 from '../../subcomponent/popup_401.svelte';

	const tags = [
        {name: 'News', value: 'news'},
		{name: 'Economics', value: 'economics'},
		{name: 'Science', value: 'science'},
        {name: 'Life style', value: 'life-style'},
        {name: 'Fashion', value: 'fashion'},
		{name: 'Sport', value: 'sport'},
        {name: 'Technology', value: 'technology'},
        {name: 'Art gallery', value: 'art-gallery'}
	];

    

	let title = $state();
	let message = $state();
	let category = $state();
	let editor = $state();
	let image;
	let thumbnail_src = $state(null);
	let onerror = $state(false);
	let oncategoryerror = $state(false);
	let ontitleerror = $state(false);
	let oncontenterror = $state(false);
    let success_message = $state(0);
    let content_data = $state();
    let content_str;

    $effect(()=>{
        title = localStorage.getItem("title") ?? "";
        thumbnail_src = localStorage.getItem("thumbnail") ?? "";
        content_data = localStorage.getItem("content") ?? "";
        category = localStorage.getItem("category") ?? "";    
    })

	$effect(() => {
        content_data = JSON.parse(content_data);
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
				},

                data: content_data
			});
		};
		loadEditor();
	});

	async function send_thumbnail(e) {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('thumbnail', file);
		const response = await fetch(`${PUBLIC_SERVER_URL}/upload`, {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (response.status != 200) {
			alert('NO');
		} else {
			console.log(result);
			thumbnail_src = result.file.url;
		}
	}

	function upload_thumbnail() {
		console.log('ok');
		image.click();
	}

	function check_submit(content) {
		if (!thumbnail_src) {
			onerror = true;
		}
		if (category == 'choosepls') {
			oncategoryerror = true;
		}
		if (!title) {
			ontitleerror = true;
		}
		if (content.blocks.length == 0) {
			oncontenterror = true;
		}
	}

	async function send_article(content) {
		const response = await fetch(`${PUBLIC_SERVER_URL}/article/new`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				title: title,
				thumbnail: thumbnail_src,
				category: category,
				content: content,
			})
		});
        const status_code = response.status;
        if (status_code == 200){
            return true;
        }else return false;
        
	}

    async function localsave(){
        let content_json = await editor.save();
        content_str = JSON.stringify(content_json);
        localStorage.setItem("title",title);
        localStorage.setItem("thumbnail", thumbnail_src);
        localStorage.setItem("content",content_str);
        localStorage.setItem("category",category);
    }

	async function submit() {
		try {
			let content_json = await editor.save();
			//console.log('Article data: ', await editor.save());
			console.log(content_json);
			check_submit(content_json);

			content_str = JSON.stringify(content_json);
			let result = await send_article(content_str);
            if (result){
                success_message = 200;
            }else{
                localStorage.setItem("title",title);
                localStorage.setItem("thumbnail", thumbnail_src);
                localStorage.setItem("content",content_str);
                localStorage.setItem("category",category);
                success_message = 401

            }

		} catch (err) {
			console.log('Article error: ', err);
		}
	}
</script>

{#if success_message==200}
    <Popup_200/>
{:else if success_message==401}
    <Popup_401/>
{/if}


<img class="w-20 h-[36px] block mx-4 mt-4" src="/logo.png" alt="logo" />
<!-- <div class="border-red-600 border-t-2 w-full h-0"></div> -->

<div class="mx-auto mt">
	<div class="flex flex-col items-center justify-center mb-10">
		<input
			bind:value={title}
			class={`font-semibold text-3xl w-3/4 text-center outline-none mx-auto mb-4 ${ontitleerror ? 'placeholder-red-500' : ''}`}
			placeholder={`${ontitleerror ? 'Title is required' : 'Article title'}`}
		/>

		{#if thumbnail_src}
			<button onclick={upload_thumbnail} class="relative">
				<img class="w-full mx-4 sm:w-[650px]" src={thumbnail_src} alt="your_thumbnail" />
				<div
					class="absolute top-0 left-0 opacity-0 hover:opacity-100 hover:backdrop-blur-lg w-full h-full text-center"
				>
					<div
						class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100 text-lg"
					>
						Change thumbnail
					</div>
				</div>
			</button>
		{:else}
			<div
				class={`flex flex-col items-center border  w-full mx-4 sm:w-[650px] h-80 rounded-lg pt-28 ${!onerror ? `border-gray-500` : `border-red-500`}`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class={`size-10 ${onerror ? 'text-red-500' : 'text-gray-500'} `}
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>
				<button
					class={`${!onerror ? 'text-gray-500' : 'text-red-500'} border-none hover:font-semibold   `}
					onclick={upload_thumbnail}
				>
					{#if !onerror}
						Upload thumbnail{:else}Thumbnail is required
					{/if}
				</button>
			</div>
		{/if}
		<input
			class="hidden"
			type="file"
			accept=".jpg, .jpeg, .png"
			bind:this={image}
			onchange={(e) => {
				send_thumbnail(e);
			}}
		/>
	</div>

	<div id="editorjs" class="text-xl"></div>
	{#if oncontenterror}
		<div class="text-red-500 text-center font-light my-3">*Content is required.</div>
	{/if}
	<div class="w-full flex items-center justify-center space-x-6 mb-12">
        <button
			onclick={localsave}
			class=" text-gray-900 bg-gray-50  hover:bg-primary-600 border-2 font-medium rounded-md text-sm px-5 py-2.5 text-center"
			>Save
		</button>
		<select
			bind:value={category}
			class={` bg-gray-50 border text-gray-900 text-sm rounded-md  block p-2.5 ${onerror ? 'border-red-500' : ''} `}
		>
			<option disabled selected value="choosepls">
				{#if !oncategoryerror}
					Choose category
				{:else}
					Category is required
				{/if}
			</option>
			{#each tags as {name, value}}
				<option value={value}>{name}</option>
			{/each}
		</select>
		<button
			type="submit"
			onclick={submit}
			class=" text-gray-100 bg-red-500 hover:bg-primary-600 border-2 border-red-500
        focus:ring-2 focus:outline-none focus:ring-red-700 focus:ring-primary-300
        font-medium rounded-md text-sm px-5 py-2.5 text-center"
			>Submit your article
		</button>
	</div>
</div>
