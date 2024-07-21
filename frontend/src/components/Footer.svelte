<script>
	import Facebook from './icons/Facebook.svelte'
	import Github from './icons/Github.svelte'
	import Mail from './icons/Mail.svelte'

	const tags = [
		'News',
		'Economics',
		'Science',
		'Life style',
		'Fashion',
		'Sport',
		'Technology',
		'Art gallery',
		'About us'
	];
</script>

<footer class="mt-20 py-4 border-t border-red-700 flex flex-col items-center space-y-8">
	<div class="flex flex-col items-center space-y-2">
		<a href="/" class="w-[200px]">
			<img src="/logo.png"  alt="The Stork Journal Logo" />
		</a>
		<div class="flex w-[200px] justify-center space-x-2">
			<Facebook>Fuck</Facebook>
			<Github/>
			<Mail/>
		</div>
	</div>
	<div class="lg:space-x-12 max-lg:flex max-lg:flex-col max-lg:space-y-4">
		{#each tags as tag}
			<a class="hover:text-slate-600" href={`/${tag.toLowerCase().replace(' ','-')}`}>{tag}</a>
		{/each}
	</div>
	<p class="text-sm font-bold tracking-wide">Created in 2024 by Xuan An, Hoa Binh and Viet Anh.</p>
</footer>