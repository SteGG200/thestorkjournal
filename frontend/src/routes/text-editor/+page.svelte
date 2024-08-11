<script>
	import '../../app.css';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import Popup_200 from '$components/popup_200.svelte';
	import Popup_401 from '$components/popup_401.svelte';
	import LoadingScreen from '$components/LoadingScreen.svelte';

	const tags = [
		'News',
		'Economics',
		'Science',
		'Life style',
		'Culture',
		'Sports',
		'Technology',
		'Art gallery'
	];

	/**@type {import('@editorjs/editorjs').default | null}*/
	let editor = $state(null);

	let title = $state('');
	let thumbnailUrl = $state('');

	/**@type {import('@editorjs/editorjs').OutputData | undefined}*/
	let content = $state(undefined);
	let category = $state('');

	let isTitleEmpty = $state(false);
	let isThumbnailEmpty = $state(false);
	let isContentEmpty = $state(false);
	let isCategoryEmpty = $state(false);

	let replyMessage = $state(200);

	let isLoading = $state(true);
	let loadingScreenOpacity = $state(100);

	/**@type {HTMLInputElement | null}*/
	let inputThumbnail = $state(null);

	$effect(() => {
		title = localStorage.getItem('title') ?? '';
		thumbnailUrl = localStorage.getItem('thumbnail') ?? '';
		category = localStorage.getItem('category') ?? '';

		const editorjsLoader = async () => {
			const savedContent = localStorage.getItem('content') ?? '';
			let contentData = undefined;
			if (savedContent != '') {
				contentData = JSON.parse(savedContent);
			}

			const ImageTool = (await import('@editorjs/image')).default;

			editor = new (await import('@editorjs/editorjs')).default({
				autofocus: false,
				placeholder: 'Article Content',
				tools: {
					image: {
						// @ts-ignore
						class: ImageTool,
						config: {
							endpoints: {
								byFile: `${PUBLIC_SERVER_URL}/upload`
							}
						}
					}
				},
				data: contentData
			});

			isLoading = false;
		};

		editorjsLoader();
	});

	const triggerInputThumbnail = () => {
		if (!inputThumbnail) return;
		inputThumbnail.click();
	};

	// @ts-ignore
	const sendThumbnail = async (e) => {
		const thumbnailFile = e.target.files[0];
		const formData = new FormData();
		formData.append('thumbnail', thumbnailFile);

		const response = await fetch(`${PUBLIC_SERVER_URL}/upload`, {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (response.status != 200) {
			alert('NO');
			return;
		}

		thumbnailUrl = result.file.url;
	};

	const checkIsValid = () => {
		let isValid = true;

		if (title == '') {
			isTitleEmpty = true;
			isValid = false;
		}

		if (thumbnailUrl == '') {
			isThumbnailEmpty = true;
			isValid = false;
		}

		if (!content || content.blocks.length == 0) {
			isContentEmpty = true;
			isValid = false;
		}

		if (category == '') {
			isCategoryEmpty = true;
			isValid = false;
		}

		return isValid;
	};

	const saveArticleToLocalStorage = () => {
		const contentStr = JSON.stringify(content);

		localStorage.setItem('title', title);
		localStorage.setItem('thumbnail', thumbnailUrl);
		localStorage.setItem('content', contentStr);
		localStorage.setItem('category', category);
	};

	const saveArticle = async () => {
		isLoading = true;
		loadingScreenOpacity = 65;
		if (!editor) {
			isLoading = false;
			return;
		}
		try {
			content = await editor.save();

			saveArticleToLocalStorage();
			isLoading = false;
		} catch (error) {
			console.log('Saving error: ' + error);
			isLoading = false;
		}
	};

	const submitArticle = async () => {
		isLoading = true;
		loadingScreenOpacity = 65;
		if (!editor) {
			isLoading = false;
			return;
		}
		try {
			content = await editor.save();
			const isValid = checkIsValid();

			if (!isValid) {
				isLoading = false;
				return;
			}

			const contentStr = JSON.stringify(content);

			const response = await fetch(`${PUBLIC_SERVER_URL}/article/new`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					title: title,
					thumbnail: thumbnailUrl,
					content: contentStr,
					category: category
				}),
				credentials: 'include'
			});

			replyMessage = response.status;
			if (response.status == 200) {
				localStorage.removeItem('title');
				localStorage.removeItem('thumbnail');
				localStorage.removeItem('content');
				localStorage.removeItem('category');
			} else if (response.status == 401) {
				saveArticleToLocalStorage();
			}
			isLoading = false;
		} catch (error) {
			console.log('Saving error: ' + error);
			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>Write Article</title>
</svelte:head>

{#if isLoading}
	<LoadingScreen className={`opacity-${loadingScreenOpacity}`} />
{/if}

{#if replyMessage == 200}
	<Popup_200>Submit sucessfully, we will send you an email after verification.</Popup_200>
{:else if replyMessage == 401}
	<Popup_401 redirect="/text-editor" buttonText="Login">You have not logged in yet.</Popup_401>
{/if}

<a class="w-20 h-[36px] block mx-4 mt-4" href="/">
	<img src="/logo.png" alt="logo" />
</a>
<div class="mx-auto mt">
	<div class="flex flex-col items-center justify-center mb-10">
		<input
			bind:value={title}
			class={`font-semibold text-3xl w-3/4 text-center outline-none mx-auto mb-4 ${isTitleEmpty ? 'placeholder-red-500' : ''}`}
			placeholder={`${isTitleEmpty ? 'Title is required' : 'Article title'}`}
		/>

		{#if thumbnailUrl}
			<button onclick={triggerInputThumbnail} class="relative">
				<img class="w-full mx-4 sm:w-[650px]" src={thumbnailUrl} alt="your_thumbnail" />
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
				class={`flex flex-col items-center border  w-full mx-4 sm:w-[650px] h-80 rounded-lg pt-28 ${!isThumbnailEmpty ? `border-gray-500` : `border-red-500`}`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class={`size-10 ${isThumbnailEmpty ? 'text-red-500' : 'text-gray-500'} `}
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>
				<button
					class={`${!isThumbnailEmpty ? 'text-gray-500' : 'text-red-500'} border-none hover:font-semibold   `}
					onclick={triggerInputThumbnail}
				>
					{#if !isThumbnailEmpty}
						Upload thumbnail{:else}Thumbnail is required
					{/if}
				</button>
			</div>
		{/if}
		<input
			class="hidden"
			type="file"
			accept=".jpg, .jpeg, .png"
			bind:this={inputThumbnail}
			onchange={(e) => {
				sendThumbnail(e);
			}}
		/>
	</div>

	<div id="editorjs" class="text-xl"></div>
	{#if isContentEmpty}
		<div class="text-red-500 text-center font-light my-3">*Content is required.</div>
	{/if}
	<div class="w-full flex items-center justify-center space-x-6 mb-12">
		<button
			onclick={saveArticle}
			class=" text-gray-900 bg-gray-50 hover:bg-primary-600 border-2 font-medium rounded-md text-sm px-5 py-2.5 text-center"
			>Save
		</button>
		<select
			bind:value={category}
			class={`bg-gray-50 border text-gray-900 text-sm rounded-md block p-2.5 ${isCategoryEmpty ? 'border-red-500' : ''} `}
			onchange={() => {
				isCategoryEmpty = false;
			}}
		>
			<option disabled selected value="">
				{#if !isCategoryEmpty}
					Choose category
				{:else}
					Category is required
				{/if}
			</option>
			{#each tags as tag}
				<option value={tag.toLowerCase().replace(' ', '-')}>{tag}</option>
			{/each}
		</select>
		<button
			type="submit"
			onclick={submitArticle}
			class="text-gray-100 bg-red-500 hover:bg-primary-600 border-2 border-red-500
		focus:ring-2 focus:outline-none focus:ring-red-700 focus:ring-primary-300
		font-medium rounded-md text-sm px-5 py-2.5 text-center"
			>Submit your article
		</button>
	</div>
</div>
