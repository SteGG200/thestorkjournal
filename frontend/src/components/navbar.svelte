<script>
	import '../app.css';
	import { goto } from '$app/navigation';

	const { isAuthenticated } = $props();
	let navbar_hidden = $state(true);
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
	function to_text_editor_or_login() {
		if (isAuthenticated) {
			goto('/text-editor');
		} else {
			goto('/login');
		}
	}
	function hide_navbar() {
		navbar_hidden = !navbar_hidden;
	}
</script>

<nav
	class="bg-white border-red-700
sticky w-full z-20 top-0 start-0 border-b"
>
	<div
		class="max-w-screen-xl mx-auto p-4
     flex flex-wrap items-center justify-between"
	>
		<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src="/logo.png" class="h-10" alt="The Stork Journal Logo" />
		</a>

		<div class="flex lg:order-2 space-x-3 lg:space-x-0 rtl:space-x-reverse">
			<button
				type="button"
				onclick={to_text_editor_or_login}
				class="text-white bg-red-700 hover:bg-red-800
        focus:ring-4 focus:outline-none focus:ring-red-800
        font-medium text-center text-sm
        rounded-lg px-4 py-2"
			>
				{#if isAuthenticated}
					Write article
				{:else}
					Login
				{/if}
			</button>

			<button
				data-collapse-toggle="navbar-sticky"
				onclick={hide_navbar}
				type="button"
				class="inline-flex items-center p-2 w-10 h-10 justify-center
        text-sm text-gray-500 rounded-lg min-[1100px]:hidden
        hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
				aria-controls="navbar-sticky"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="w-5 h-5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 17 14"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M1 1h15M1 7h15M1 13h15"
					/>
				</svg>
			</button>
		</div>

		<div
			class={`items-center justify-between ${navbar_hidden ? 'hidden' : ''}
        w-full min-[1100px]:flex min-[1100px]:w-auto min-[1100px]:order-1`}
			id="navbar-sticky"
		>
			<ul
				class="flex flex-col p-4 lg:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 lg:space-x-8 rtl:space-x-reverse lg:flex-row lg:mt-0 lg:border-0 lg:bg-white"
			>
				{#each tags as tag}
					<li>
						<a
							href={`/category/${tag.toLowerCase().replace(' ', '-')}`}
							class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-red-700 lg:p-0"
							>{tag}</a
						>
					</li>
				{/each}
				<li>
					<a
						class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-red-700 lg:p-0"
						href="/about-us">About us</a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>
