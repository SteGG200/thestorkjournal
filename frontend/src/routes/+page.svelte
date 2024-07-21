<script>
	//import { get } from "svelte/store";
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import '../app.css';
	import Navbar from '$components/navbar.svelte';
    import PageButton from '../components/page_button.svelte';
    import Footer from '$components/Footer.svelte';
    //import { current_page } from "$lib/store.js"
    import EtcButton from '../components/Etc_button.svelte';
	import { goto } from '$app/navigation';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import Page from './text-editor/+page.svelte';
	/** @type {import('./$types').PageData} */
    const{ data } = $props();

    let current_number_page = $state(1);
    const article_per_page = 5;
    const article_number = data.item.articles.length;
    const pages = Math.ceil(article_number / article_per_page);
	const plugins = [Autoplay()];
	const options = { delay: 2000, loop: true, watchDrag: false };

	let emblaApi;

	function onInit(event) {
		emblaApi = event.detail;
		//console.log(emblaApi.slideNodes());
	}

	function scroll_previous() {
		if (emblaApi) {
			emblaApi.scrollPrev();
		}
	}

	function scroll_next() {
		if (emblaApi) {
			emblaApi.scrollNext();
		}
	}

    console.log(data);

// content
// : 
// "{\"time\":1721571779892,\"blocks\":[{\"id\":\"ZKaQXgIL1F\",\"type\":\"paragraph\",\"data\":{\"text\":\"This is a new article\"}}],\"version\":\"2.30.2\"}"

	function sth() {
		console.log(data.item);
	}
    
</script>

<Navbar />

<div class="mt-20">
	<div class="md:mx-32 mx-8 relative">
		<div
			class="overflow-hidden"
			use:emblaCarouselSvelte={{ plugins, options }}
			onemblaInit={onInit}
		>
			<div class="flex w-full aspect-[2/1]">
				{#each data.item.articles as article, i}
					<div
						class="flex-none w-full min-w-0 bg-center bg-cover"
						style={`background-image: url('${article.thumbnail}')`}
					>
						<!-- <img class="w-full mx-auto object-center" src={article.thumbnail} alt="lmao idk"> -->
						<div
							class="bg-gradient-to-b from-transparent to-gray-900 w-full h-full text-white flex flex-col-reverse px-8 pb-4 md:p-12"
						>
							<p class="text-gray-500 text-md">
								By: {article.name} on {new Date(article.date_publish).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
                            <div class="hidden md:block text-gray-400 pb-4">
                                <p class="line-clamp-3">{@html JSON.parse(article.content).blocks[0].data.text}</p>
                            </div>
							<a href="/{article.id}">
                                <h1 class="text-xl md:text-4xl pb-2 md:pb-4 hover:text-gray-400">{article.title}</h1>
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
	<div class=" mt-12 md:mx-32 mx-8">
		<div class="md:flex md:flex-row border-t-2 border-gray-300 py-8">
			<!-- <div> if anythisadsádasdaádsadsadsadasdsadng here</div> -->
			<div class=" w-full md:w-2/3 md:border-r-2 border-gray-300">
				{#each data.item.articles.slice( (current_number_page-1) * article_per_page , Math.min(current_number_page*article_per_page , article_number) ) as article, i}
					<div class="flex flex-row items-center mt-4 mx-4">
                        
                        <button
                            class="w-2/3 aspect-[14/8] bg-center bg-cover"
                            style={`background-image: url('${article.thumbnail}')`}
                            onclick={()=>{goto(`/${article.id}`)}}
                        ></button>
                        
						<div class="ml-4 w-full items-center">
							<a href="/{article.id}" class="text-xl font-medium hover:text-gray-800">
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
						<!-- <img src={article.thumbnail} alt="idk"> -->
					</div>
                    <div class="pb-8 border-b-2 border-gray-300 mx-4 mt-4 ">
                        <p class="line-clamp-3">{@html JSON.parse(article.content).blocks[0].data.text}</p>
                    </div>
				{/each}

                <div class="flex flex-row m-4 items-center justify-center">
                    {#if current_number_page!=1}
                        <PageButton page_number={"Previous"} change_page={()=>{
                            current_number_page--;
                        }}/>
                    {/if}

                    <PageButton page_number={1} change_page={()=>{
                        current_number_page=1;
                    }}/>

                    {#if current_number_page>3}
                        <EtcButton/>
                    {/if}
                    
                    {#if current_number_page>2}
                        <PageButton page_number={current_number_page-1} change_page={()=>{
                            current_number_page--;
                        }}/>
                    {/if}
                    
                    {#if current_number_page!=1 && current_number_page!=pages}
                        <PageButton page_number={current_number_page} change_page={()=>{
                        }}/>
                    {/if}
                
                    {#if current_number_page < pages-1  }
                        <PageButton page_number={current_number_page+1} change_page={()=>{
                            current_number_page++;
                        }}/>
                    {/if}

                    {#if current_number_page< pages-2}
                        <EtcButton/>
                    {/if}
                    
                    {#if current_number_page != 1}
                    <PageButton page_number={pages} change_page={()=>{
                        current_number_page=pages;
                    }}/>
                    {/if}

                    {#if current_number_page != pages }
                        <PageButton page_number={"Next"} change_page={()=>{
                            current_number_page++;
                        }}/>
                    {/if}
                </div>
			</div>

			<div class="border-t-2 border-gray-300 pt-8 md:pt-0 md:border-none">
                <div class="text-gray-600 font-semibold px-4 pb-4 text-md">Suggested for you</div>
				{#each data.item.articles as article, i}
                    <div class="flex flex-row mb-4 items-center mx-4">
                        <button
                            class="w-1/4 aspect-square bg-center bg-cover"
                            style={`background-image: url('${article.thumbnail}')`}
                            onclick={()=>{goto(`/${article.id}`)}}
                        ></button>
                        <div class="mx-4 w-full text-sm font-semibold">
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

<Footer/>
