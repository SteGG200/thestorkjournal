<script>
	import { goto } from '$app/navigation';
</script>

<div
	class="w-full h-full fixed top-0 backdrop-brightness-50 flex flex-col items-center justify-center z-10"
>
	<div class="fixed mx-auto top-1/3 bg-white rounded-md w-full max-w-md text-center">
		<div class=" m-4 mt-8">Have not logged in yet.</div>
		<button
			class="mx-auto bg-red-600 text-white rounded my-4 p-2 hover:bg-red-700"
			onclick={() => {
				goto('/login');
			}}>Login</button
		>
	</div>
</div>
