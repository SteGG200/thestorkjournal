<script>
	import { PUBLIC_SERVER_URL } from "$env/static/public";
	import Page from "../routes/+page.svelte";
	import Navbar from "./navbar.svelte";
    import Popup from "./popup.svelte";

    const tags= ["News", "Politics", "Economies", "Science","Entertainment", "Sport","Art gallery", "About"];
    const onmessage=false;
    let title=$state();
    let message = $state();

    $effect(() => {
        const loadEditor = async () => {
            const ImageTool = (await import("@editorjs/image")).default;
            const editor = new (await import("@editorjs/editorjs")).default({
                autofocus: true,
                placeholder: 'Article Content',
                tools: {
                    image:{
                        //@ts-ignore
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: `${PUBLIC_SERVER_URL}/upload`,
                                byUrl: `${PUBLIC_SERVER_URL}`,
                            }
                        }
                    }
                }
            });
        }
        loadEditor();
    });

    function check_submit(){
        if (title.length < 10){
            message = "Title must contain at least 10 characters."
        }
        
    }

    function submit(){

    }


</script>
{#if onmessage}
    <Popup/>
{/if}
<Navbar/>
<div class="flex pb-10 pt-24">
    <input bind:value={title} class="font-bold text-3xl w-3/4 text-center outline-none mx-auto" placeholder="Article title">
</div>
<div id="editorjs" class="text-xl" placeholder="Article content"></div> 
<div class="w-full flex items-center justify-center">
    <button type="button" onclick={submit}
        class="w-1/6 text-gray-100 bg-red-700 hover:bg-primary-700
         focus:ring-4 focus:outline-none focus:ring-red-800 focus:ring-primary-300 
         font-medium rounded-lg text-base px-5 py-2.5 text-center ">Submit</button>
</div>
