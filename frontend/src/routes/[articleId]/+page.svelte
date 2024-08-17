<script>
	import NavBar from '$components/navbar.svelte';
	import Footer from '$components/Footer.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.article.title}</title>
</svelte:head>

<NavBar isAuthenticated={data.isAuthenticated} />

<section class="mt-10 max-lg:mt-10 max-sm:mt-4 space-y-4 max-sm:space-y-2">
	<p
		class="text-center text-4xl font-bold max-sm:text-2xl w-[800px] max-lg:w-full max-lg:px-4 mx-auto"
	>
		{data.article.title}
	</p>
	<p class="text-center max-sm:text-sm">
		By {data.authorName} on {new Date(data.article.datePublish).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}
	</p>
	<img
		class="mx-auto p-3 w-[800px] max-lg:px-4 max-lg:w-full"
		src={data.article.thumbnail}
		alt="notfound"
	/>
	<div class="w-[600px] max-[600px]:w-full max-[600px]:px-4 mx-auto space-y-6">
		{#each JSON.parse(data.article.content).blocks as block}
			{#if block.type == 'paragraph'}
				<div class="text-lg max-sm:text-base content whitespace-normal overflow-hidden text-ellipsis">{@html block.data.text}</div>
			{:else if block.type == 'image'}
				<img class="w-full" src={block.data.file.url} alt="image_not_found" />
				{#if block.data.caption}
					<p class=" text-sm text-center">{block.data.caption}</p>
				{/if}
			{/if}
		{/each}
	</div>
</section>

<Footer />
