<!--     
    <div tabindex="-1" class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ">
        <div class="relative p-4 w-full max-w-md mx-auto max-h-full ">
            <div class="relative bg-white rounded-lg shadow">
                <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <div class="p-4 md:p-5 text-center">
                    
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                    
                </div>
            </div>
        </div>
    </div>
     -->

<script>
	import { goto } from '$app/navigation';
</script>

<div
	class="w-full h-full fixed top-0 backdrop-brightness-50 flex flex-col items-center justify-center z-10"
>
	<div class="fixed mx-auto top-1/3 bg-white rounded-md w-full max-w-md text-center">
		<div class=" m-4 mt-8">Submit sucessfully, we will send you an email after verification.</div>
		<button
			class="mx-auto bg-red-600 text-white rounded my-4 p-2 hover:bg-red-700"
			onclick={() => {
				goto('/.');
			}}>Return home</button
		>
	</div>
</div>
