<script>
	//import { get } from "svelte/store";
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import '../app.css';
	import Navbar from '$components/navbar.svelte';

	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	/** @type {import('./$types').PageData} */
	export let data;
	const plugins = [Autoplay()];
	const options = { delay: 2000, loop: true, watchDrag: false};

	let emblaApi;

	function onInit(event) {
		emblaApi = event.detail;
		console.log(emblaApi.slideNodes());
	}

    function scroll_previous(){
        if(emblaApi){
            emblaApi.scrollPrev();
        }
    }

    function scroll_next(){
        if(emblaApi){
            emblaApi.scrollNext();
        }
    }

	//{
	// "date_publish": "2024-07-02T00:00:00.000Z",
	// "title": "New Article",
	// "thumbnail": "https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/446810132_475189898322908_1339928912308263727_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFZISB5YvXLh8o1OwfNMKXud_Ue59OMRV939R7n04xFX21ztbt5QNy9T3nOMNdW2DWXR1uLIljoAJvjTKzsUjJh&_nc_ohc=6gmndcQ3-vUQ7kNvgGKmnMR&_nc_ht=scontent.fhan3-2.fna&oh=00_AYCc5cfN4Hrb_3GSFTlYugnk_YUE4_icTazJMEpr6Q91jQ&oe=6689BB98",
	// "category": "sport",
	// "content": "This is a new article"
	function sth() {
		console.log(data.item.articles);
	}
</script>

<Navbar />

<div class="mt-20">
	<div class="md:mx-52 mx-8 relative">
		<div class="overflow-hidden" use:emblaCarouselSvelte={{ plugins, options }} onemblaInit="{onInit}">
			<div class="flex w-full aspect-[2/1]">
				{#each data.item.articles as article, i}
					<div
						class="flex-none w-full min-w-0 bg-center bg-cover"
						style={`background-image: url('${article.thumbnail}')`}
					>
						<!-- <img class="w-full mx-auto object-center" src={article.thumbnail} alt="lmao idk"> -->
						<div class="bg-gradient-to-b from-transparent to-gray-900 w-full h-full text-white flex flex-row items-center px-12">
							<p class="text-3xl">{article.title}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
        <div class="absolute top-1/2 w-full -translate-y-1/2 flex px-2 justify-between">
            <button class="text-white" onclick={scroll_previous}>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
            </button>
            <button class="text-white" onclick={scroll_next}>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
            </button>
        </div>

		
	</div>
</div>
<button onclick={sth}> this is button</button>
