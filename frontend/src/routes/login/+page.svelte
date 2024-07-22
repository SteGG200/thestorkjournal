<script>
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import '../../app.css';
	import { goto } from '$app/navigation';
	import { log_in_fail_message, logged_in } from '$lib/store.js';
	let email = $state('');
	let password = $state('');

	async function fetch_login_data() {
		const response = await fetch(`${PUBLIC_SERVER_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			}),
			credentials: 'include'
		});
		const status_code = response.status;
		if (status_code == 200) {
			console.log('ok');
			logged_in.set(true);
			let previousPage = sessionStorage.getItem('from') ?? '/';
			sessionStorage.removeItem('from');
			goto(previousPage);
		} else if (status_code == 401) {
			log_in_fail_message.set(true);
		}
	}
</script>

<section class="bg-gray-200">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
			<img class="w-36 h-16 mr-2" src="/logo.png" alt="logo" />
		</a>
		<div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
					Sign in to your account
				</h1>
				<form class="space-y-4 md:space-y-6" action="#">
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							bind:value={email}
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							placeholder=""
							required={true}
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
							placeholder=""
							bind:value={password}
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							required={true}
						/>
					</div>

					{#if $log_in_fail_message}
						<div class="text-red-500">Wrong email or password.</div>
					{/if}
					<button
						type="submit"
						onclick={fetch_login_data}
						class="w-full text-gray-100 bg-red-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-red-800 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
					>
						Sign in
					</button>
					<p class="text-sm font-light text-gray-700">
						Don’t have an account yet?
						<a href="/signup" class="font-medium text-primary-600 hover:underline">Sign up</a>
					</p>
				</form>
			</div>
		</div>
	</div>
</section>
