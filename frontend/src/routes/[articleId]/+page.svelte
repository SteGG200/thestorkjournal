<script>
	import NavBar from '$components/navbar.svelte';
	import Footer from '$components/Footer.svelte';

	const { data } = $props();
</script>

<NavBar isAuthenticated={data.isAuthenticated} />

<section class="mt-10 max-lg:mt-10 max-sm:mt-4 space-y-4 max-sm:space-y-2">
	<p
		class="text-center text-4xl font-bold max-sm:text-2xl w-[800px] max-lg:w-full max-lg:px-2 mx-auto"
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
	<img class="mx-auto p-3" src={data.article.thumbnail} alt="notfound" />
	<div class="w-[600px] max-[600px]:w-full max-[600px]:px-2 mx-auto space-y-6">
		{#each JSON.parse(data.article.content).blocks as block}
			<div class="text-lg max-sm:text-base content">{@html block.data.text}</div>
		{/each}
	</div>
</section>

<Footer />
