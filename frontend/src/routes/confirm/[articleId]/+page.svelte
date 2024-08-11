<script>
	import { page } from '$app/stores';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import Popup_200 from '$components/popup_200.svelte';
	import Popup_401 from '$components/popup_401.svelte';
	import '../../../app.css';
	import LoadingScreen from '$components/LoadingScreen.svelte';
	import Button from '$components/Button.svelte';

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

	let isLoading = $state(false);

	let isAuthenticated = $state(false);

	/**@type {import('@editorjs/editorjs').default | null}*/
	let editor = $state(null);

	let confirmKey = $state('');
	let isAuthenticationFail = $state(false);

	let title = $state('');
	let thumbnail = $state('');
	/**@type {import('@editorjs/editorjs').OutputData | undefined}*/
	let content = $state(undefined);
	let category = $state('');
	let authorId = $state(0);
	let isConfirm = $state(false);

	let isTitleEmptyError = $state(false);
	let isThumbnailEmptyError = $state(false);
	let isContentEmptyError = $state(false);
	let isCategoryEmptyError = $state(false);

	/**@type {HTMLInputElement | null}*/
	let inputThumbnail = $state(null);

	let replyMessage = $state(0);

	/**@type {import('svelte/action').Action}*/
	const editorjsLoader = async () => {
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
			data: content
		});
	};

	const triggerInputThumbnail = () => {
		if (inputThumbnail) {
			inputThumbnail.click();
		}
	};

	// @ts-ignore
	const sendThumbnail = async (e) => {
		const thumbnailFile = e.target?.files[0];
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

		thumbnail = result.file.url;
	};

	const authenticate = async () => {
		const response = await fetch(
			`${PUBLIC_SERVER_URL}/article/confirm/${$page.params.articleId}/get`,
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ confirmKey })
			}
		);

		if (response.status === 200) {
			const result = await response.json();

			title = result.article.title;
			thumbnail = result.article.thumbnail;
			content = JSON.parse(result.article.content);
			category = result.article.category;
			authorId = result.authorId;

			isAuthenticated = true;
			isAuthenticationFail = false;
		} else {
			isAuthenticationFail = true;
		}
	};

	const checkIsValid = () => {
		let isValid = true;

		if (title == '') {
			isTitleEmptyError = true;
			isValid = false;
		}

		if (thumbnail == '') {
			isThumbnailEmptyError = true;
			isValid = false;
		}

		if (!content || content.blocks.length == 0) {
			isContentEmptyError = true;
			isValid = false;
		}

		if (category == '') {
			isCategoryEmptyError = true;
			isValid = false;
		}

		return isValid;
	};

	const updateContent = async () => {
		if (!editor) return;
		content = await editor.save();

		if (!checkIsValid()) {
			return;
		}

		const response = await fetch(`${PUBLIC_SERVER_URL}/article/confirm/${$page.params.articleId}`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				confirmKey,
				article: {
					title,
					thumbnail,
					content: JSON.stringify(content),
					category
				},
				authorId,
				confirmStatus: isConfirm
			})
		});

		replyMessage = response.status;
	};

	const onSubmit = async () => {
		isLoading = true;
		if (!isAuthenticated) {
			await authenticate();
		} else {
			await updateContent();
		}
		isLoading = false;
	};
</script>

<svelte:head>
	<title>Confirm Article</title>
</svelte:head>

<form onsubmit={onSubmit}>
	{#if !isAuthenticated}
		<div class="w-full h-screen bg-gray-200 flex justify-center items-center max-md:px-4">
			<div
				class="bg-white w-[500px] flex flex-col items-center p-6 space-y-4 rounded-lg shadow max-md:w-full"
			>
				<div class="w-full space-y-2">
					<label for="key">Confirm Key</label>
					<input
						class="w-full h-[40px] bg-gray-50 border-2 border-gray-300 rounded-lg outline-none p-2.5"
						name="key"
						type="text"
						bind:value={confirmKey}
						disabled={isLoading}
						autocomplete="off"
						required
					/>
				</div>
				{#if isAuthenticationFail}
					<p class="text-red-500">Your key is wrong</p>
				{/if}
				<!-- <button
					class="w-full bg-red-700 hover:bg-red-800 rounded-lg py-1 text-gray-100"
					type="submit"
					disabled={isLoading}>Submit</button
				> -->
				<Button
					className="w-full bg-red-700 hover:bg-red-750 disabled:bg-red-800 rounded-lg py-1 text-gray-100"
					type="submit"
					isPending={isLoading}
				>
					Submit
				</Button>
			</div>
		</div>
	{:else}
		{#if isLoading}
			<LoadingScreen className="opacity-65" />
		{/if}
		{#if replyMessage == 200}
			<Popup_200>
				{isConfirm ? 'Confirm' : 'Reject'} the article successfully. We will send an email to author
				immediately
			</Popup_200>
		{:else if replyMessage != 0}
			<Popup_401 redirect="/" buttonText="Return Home">There are some errors on server.</Popup_401>
		{/if}
		<div class="w-full h-full flex flex-col items-center py-8 max-md:py-4 space-y-4">
			<input
				class={`font-semibold text-3xl w-3/4 text-center outline-none mx-auto mb-4`}
				type="text"
				placeholder={`${isTitleEmptyError ? 'Title is required' : 'Article title'}`}
				disabled={isLoading}
				bind:value={title}
			/>

			{#if thumbnail}
				<button onclick={triggerInputThumbnail} class="relative">
					<img class="w-full mx-4 sm:w-[650px]" src={thumbnail} alt="your_thumbnail" />
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
					class={`flex flex-col items-center border  w-full mx-4 sm:w-[650px] h-80 rounded-lg pt-28 ${!isThumbnailEmptyError ? `border-gray-500` : `border-red-500`}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class={`size-10 ${isThumbnailEmptyError ? 'text-red-500' : 'text-gray-500'} `}
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
						/>
					</svg>
					<button
						class={`${!isThumbnailEmptyError ? 'text-gray-500' : 'text-red-500'} border-none hover:font-semibold   `}
						onclick={triggerInputThumbnail}
					>
						{#if !isThumbnailEmptyError}
							Upload thumbnail{:else}Thumbnail is required
						{/if}
					</button>
				</div>
			{/if}
			<input
				class="hidden"
				type="file"
				accept=".jpg, .jpeg, .png"
				disabled={isLoading}
				bind:this={inputThumbnail}
				onchange={sendThumbnail}
			/>
			<div id="editorjs" class="text-xl w-full" use:editorjsLoader></div>
			{#if isContentEmptyError}
				<p class="text-red-500 text-center font-light my-3">*Content is required.</p>
			{/if}
			<div class="w-full flex justify-center space-x-4">
				<select
					disabled={isLoading}
					bind:value={category}
					class={` bg-gray-50 border text-gray-900 rounded-md  block p-2.5 ${isCategoryEmptyError ? 'border-red-500' : ''} `}
				>
					<option disabled selected value="">
						{#if !isCategoryEmptyError}
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
					class="bg-red-500 hover:bg-red-600 rounded-md px-2 text-gray-100"
					onclick={() => {
						isConfirm = true;
					}}
				>
					Confirm
				</button>
				<button
					type="submit"
					class="bg-gray-50 hover:bg-gray-100 rounded-md px-2 border-2"
					onclick={() => {
						isConfirm = false;
					}}
				>
					Reject
				</button>
			</div>
		</div>
	{/if}
</form>
