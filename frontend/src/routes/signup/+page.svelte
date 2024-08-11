<script>
	import { enhance } from '$app/forms';
	import Button from '$components/Button.svelte';
	import '../../app.css';

	const { form } = $props();

	let email = $state('');
	let name = $state('');
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<section class="bg-gray-200">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh lg:py-0">
		<a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
			<img class="w-36 h-16 mr-2" src="/logo.png" alt="logo" />
		</a>
		<div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
					Create an account
				</h1>
				<form
					class="space-y-4 md:space-y-6"
					method="POST"
					use:enhance={() => {
						isLoading = true;
						return async ({ update, result }) => {
							await update();
							if (
								result.type == 'success' &&
								result.data &&
								result.data.previousState &&
								typeof result.data.previousState == 'object'
							) {
								const previousState = result.data.previousState;
								if ('email' in previousState && typeof previousState.email === 'string') {
									email = previousState.email;
								}

								if ('name' in previousState && typeof previousState.name === 'string') {
									name = previousState.name;
								}
							}
							isLoading = false;
						};
					}}
				>
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							bind:value={email}
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							required
						/>
					</div>
					<div>
						<label for="name" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
						<input
							type="name"
							name="name"
							id="name"
							bind:value={name}
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							required
						/>
					</div>
					<div>
						<label for="password" class="block mb-2 text-sm font-medium text-gray-900"
							>Password</label
						>
						<input
							type="password"
							name="password"
							id="password"
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							required
						/>
					</div>
					<div>
						<label for="password" class="block mb-2 text-sm font-medium text-gray-900"
							>Comfirm password</label
						>
						<input
							type="password"
							name="re_password"
							id="re_password"
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							required
						/>
					</div>
					{#if form && !form.success}
						<div class="text-red-500">{form.error}</div>
					{/if}
					<Button
						type="submit"
						className="w-full text-gray-100 bg-red-700 hover:bg-red-750 disabled:bg-red-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
						isPending={isLoading}
					>
						Create an account
					</Button>
					<p class="text-sm font-light text-gray-700">
						Already have an account?
						<a href="/login" class="font-medium text-primary-600 hover:underline"> Login here </a>
					</p>
				</form>
			</div>
		</div>
	</div>
</section>
