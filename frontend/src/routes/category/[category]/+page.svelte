<script>
	import Navbar from '../../../components/navbar.svelte';
	import Footer from '../../../components/Footer.svelte';
	import { suggestArticles } from '$lib/utils.js';
	import { page } from '$app/stores';
	import { formatCategory } from '$lib/utils.js';
	import PageButton from '$components/page_button.svelte';
	import EtcButton from '$components/Etc_button.svelte';
	import { take_first_para } from '$lib/utils.js';

	const { data } = $props();

	const limit_suggested_article = 5;
</script>

<svelte:head>
	<title>{formatCategory($page.params.category)}</title>
</svelte:head>

<Navbar isAuthenticated={data.isAuthenticated} />

<div
	class="min-h-screen mx-auto w-3/4 max-xl:w-4/5 max-md:w-full max-md:px-4 pt-4 flex max-md:flex-col-reverse justify-center max-md:justify-end md:space-x-4"
>
	{#if data.articles.length > 0}
		<div class="md:border-r-2 md:pr-4 w-1/3 max-md:w-full space-y-4 mt-4">
			<p class="font-semibold text-gray-600 text-center">Suggested for you</p>
			<div class="space-y-2 max-md:space-y-6">
				{#each suggestArticles(data.latestArticles, limit_suggested_article) as article}
					<p class="line-clamp-2">
						<a class="text-[#176db3] hover:text-gray-800" href={`/${article.id}`}>{article.title}</a
						>
					</p>
				{/each}
			</div>
		</div>
		<div class="w-2/3 max-md:w-full space-y-8">
			<div class="flex flex-col space-y-4 border-b-2 pb-8 w-5/6 max-[1100px]:w-full">
				<p class="text-3xl max-sm:text-2xl font-bold line-clamp-3">
					<a href={`/${data.articles[0].id}`} class="hover:text-slate-600"
						>{data.articles[0].title}</a
					>
				</p>
				<p class="text-gray-500">
					By {data.articles[0].name} on {new Date(data.articles[0].date_publish).toLocaleDateString(
						'en-US',
						{
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						}
					)}
				</p>
				<a href={`/${data.articles[0].id}`}>
					<img
						class="aspect-[14/8] w-full object-cover hover:brightness-110"
						src={data.articles[0].thumbnail}
						alt="notfound"
					/>
				</a>
				<p class="content line-clamp-3 bold-child-none">
					{@html take_first_para(data.articles[0].content.blocks)}
				</p>
			</div>
			{#if data.articles.length > 1}
				{#each data.articles.slice(1) as article}
					<div class="border-b-2 pb-8 space-y-4">
						<div class="flex w-5/6 max-[1100px]:w-full items-center space-x-4">
							<a href={`/${article.id}`} class="w-3/4 max-lg:w-[250px]">
								<img
									class="aspect-[14/8] w-full object-cover hover:brightness-110"
									src={article.thumbnail}
									alt="notfound"
								/>
							</a>
							<div class="w-full">
								<a href={`/${article.id}`}>
									<p class="line-clamp-3 text-xl font-semibold hover:text-gray-600">
										{article.title}
									</p>
								</a>
								<p class="text-gray-500">
									By {article.name} on {new Date(article.date_publish).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>
						</div>
						<p class="content line-clamp-3 text-sm">
							{@html take_first_para(article.content.blocks)}
						</p>
					</div>
				{/each}
			{/if}
			<div class="flex flex-row m-4 items-center justify-center space-x-2">
				{#if data.currentPage != 1}
					<PageButton path={$page.url.pathname} page_number={data.currentPage - 1}
						>Previous</PageButton
					>
				{/if}

				<PageButton path={$page.url.pathname} page_number={1} disabled={data.currentPage == 1}
					>1</PageButton
				>

				{#if data.currentPage - 1 >= 3}
					<EtcButton />
				{/if}

				{#if data.currentPage - 1 > 1}
					<PageButton path={$page.url.pathname} page_number={data.currentPage - 1}>
						{data.currentPage - 1}
					</PageButton>
				{/if}

				{#if data.currentPage != 1 && data.currentPage != data.totalPage}
					<PageButton path={$page.url.pathname} page_number={data.currentPage} disabled>
						{data.currentPage}
					</PageButton>
				{/if}

				{#if data.currentPage + 1 < data.totalPage}
					<PageButton path={$page.url.pathname} page_number={data.currentPage + 1}>
						{data.currentPage + 1}
					</PageButton>
				{/if}

				{#if data.totalPage - data.currentPage >= 3}
					<EtcButton />
				{/if}

				{#if data.totalPage != 1}
					<PageButton
						path={$page.url.pathname}
						page_number={data.totalPage}
						disabled={data.currentPage == data.totalPage}
					>
						{data.totalPage}
					</PageButton>
				{/if}

				{#if data.currentPage != data.totalPage}
					<PageButton path={$page.url.pathname} page_number={data.currentPage + 1}>Next</PageButton>
				{/if}
			</div>
		</div>
	{:else}
		<p class="text-4xl max-md:text-xl text-center">
			Sorry, we can't find any article related to '{formatCategory($page.params.category)}' for you.
		</p>
	{/if}
</div>

<Footer />
