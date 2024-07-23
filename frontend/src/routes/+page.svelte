<script>
	import '../app.css';
	import Navbar from '$components/navbar.svelte';
	import PageButton from '$components/page_button.svelte';
	import Footer from '$components/Footer.svelte';
	import EtcButton from '$components/Etc_button.svelte';
	import { goto } from '$app/navigation';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import { suggestArticles } from '$lib/utils.js';

	/** @type {import('./$types').PageData} */
	const { data } = $props();

	let current_page_number = $state(1);
	const article_per_page = 5;
	const article_number = data.articles.length;
	const number_pages = Math.ceil(article_number / article_per_page);

	const limit_suggested_article = 3;

	const plugins = [
		Autoplay({
			delay: 5000,
			stopOnInteraction: false
		})
	];
	const options = { loop: true };

	let emblaApi;

	function onInit(event) {
		emblaApi = event.detail;
	}

	function scroll_previous() {
		if (emblaApi) {
			emblaApi.scrollPrev();
			const autoplay = emblaApi.plugins().autoplay;
			autoplay.stop();
			setTimeout(() => {
				autoplay.play();
			}, 500);
		}
	}

	function scroll_next() {
		if (emblaApi) {
			emblaApi.scrollNext();
			const autoplay = emblaApi.plugins().autoplay;
			autoplay.stop();
			setTimeout(() => {
				autoplay.play();
			}, 500);
		}
	}
</script>

<svelte:head>
	<title>The Stork Journal</title>
	<meta name="description" content="The Stork Journal" />
</svelte:head>

<Navbar isAuthenticated={data.isAuthenticated} />

<div class="pt-10">
	<div class="mx-auto max-md:mx-4 w-4/5 max-md:w-auto relative">
		<div
			class="overflow-hidden"
			use:emblaCarouselSvelte={{ plugins, options }}
			onemblaInit={onInit}
		>
			<div class="flex w-full aspect-[2/1]">
				{#each data.articles.slice(0, 5) as article}
					<div
						class="flex-none w-full min-w-0 bg-center bg-cover"
						style={`background-image: url('${article.thumbnail}')`}
					>
						<!-- <img class="w-full mx-auto object-center" src={article.thumbnail} alt="lmao idk"> -->
						<div
							class="bg-gradient-to-b from-transparent to-gray-900 w-full h-full text-white flex flex-col-reverse px-8 pb-4 md:p-12 space-y-2"
						>
							<p class="text-gray-500 text-md">
								By: {article.name} on {new Date(article.date_publish).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
							<div class="hidden md:block text-gray-400 pb-4 w-2/3">
								<p class="line-clamp-3">{@html JSON.parse(article.content).blocks[0].data.text}</p>
							</div>
							<a class="pb-2 md:pb-4 hover:text-gray-400 w-1/2 max-lg:w-full" href="/{article.id}">
								<h1 class="text-xl md:text-4xl">
									{article.title}
								</h1>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="absolute top-1/2 w-full -translate-y-1/2 flex px-2 justify-between">
			<button class="text-white" onclick={scroll_previous}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg
				>
			</button>
			<button class="text-white" onclick={scroll_next}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6l6 6l-6 6" /></svg
				>
			</button>
		</div>
	</div>
	<div class="mt-12 md:mx-auto mx-4 w-4/5 max-md:w-auto">
		<div class="md:flex md:flex-row border-t-2 border-gray-300 py-8">
			<div class="max-lg:w-auto w-2/3 md:border-r-2 border-gray-300">
				{#each data.articles.slice((current_page_number - 1) * article_per_page, Math.min(current_page_number * article_per_page, article_number)) as article}
					<div class="flex flex-row items-center mt-4 mx-4">
						<button
							class="w-2/3 max-lg:w-[250px] aspect-[14/8] bg-center bg-cover"
							style={`background-image: url('${article.thumbnail}')`}
							onclick={() => {
								goto(`/${article.id}`);
							}}
						></button>

						<div class="ml-4 w-full items-center">
							<a href="/{article.id}" class="text-xl font-semibold hover:text-gray-600">
								<p class="line-clamp-3">{article.title}</p>
							</a>
							<p class="text-gray-500">
								By: {article.name} on {new Date(article.date_publish).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
						</div>
					</div>
					<div class="pb-8 border-b-2 border-gray-300 mx-4 mt-4">
						<p class="line-clamp-3 content">
							{@html JSON.parse(article.content).blocks[0].data.text}
						</p>
					</div>
				{/each}

				<div class="flex flex-row m-4 items-center justify-center">
					{#if current_page_number != 1}
						<PageButton
							page_number={'Previous'}
							change_page={() => {
								current_page_number--;
							}}
						/>
					{/if}

					<PageButton
						page_number={1}
						disabled={current_page_number == 1}
						change_page={() => {
							current_page_number = 1;
						}}
					/>

					{#if current_page_number - 1 >= 3}
						<EtcButton />
					{/if}

					{#if current_page_number - 1 > 1}
						<PageButton
							page_number={current_page_number - 1}
							change_page={() => {
								current_page_number--;
							}}
						/>
					{/if}

					{#if current_page_number != 1 && current_page_number != number_pages}
						<PageButton page_number={current_page_number} disabled={true} />
					{/if}

					{#if current_page_number + 1 < number_pages}
						<PageButton
							page_number={current_page_number + 1}
							change_page={() => {
								current_page_number++;
							}}
						/>
					{/if}

					{#if number_pages - current_page_number >= 3}
						<EtcButton />
					{/if}

					{#if number_pages != 1}
						<PageButton
							page_number={number_pages}
							disabled={current_page_number == number_pages}
							change_page={() => {
								current_page_number = number_pages;
							}}
						/>
					{/if}

					{#if current_page_number != number_pages}
						<PageButton
							page_number={'Next'}
							change_page={() => {
								current_page_number++;
							}}
						/>
					{/if}
				</div>
			</div>

			<div
				class="max-md:border-t-2 max-md:border-gray-300 max-md:pt-8 pt-0 border-none w-1/3 max-md:w-auto"
			>
				<div class="text-gray-600 font-semibold px-4 pb-4 text-md">Suggested for you</div>
				{#each suggestArticles(data.articles, limit_suggested_article) as article}
					<div class="flex flex-row mb-4 items-center mx-4">
						<button
							class="w-1/4 max-lg:w-[60px] aspect-square bg-center bg-cover"
							style={`background-image: url('${article.thumbnail}')`}
							onclick={() => {
								goto(`/${article.id}`);
							}}
						></button>
						<div class="mx-4 w-full text-base text-[#176db3]">
							<a href="/{article.id}" class="hover:text-gray-800">
								<p class="line-clamp-2">{article.title}</p>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- <button onclick={sth}> this is button</button> -->

<Footer />
