<script>
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import '../../app.css';
	import Navbar from '../../components/navbar.svelte';
	import { goto } from '$app/navigation';
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let re_password = $state('');
	let is_create_success = $state(true);
	let error_message = $state();
	function create_account() {
		if (password != re_password) {
			is_create_success = false;
			error_message = 'Password do not match.';
		} else {
			fetch_sign_up_data();
		}
	}
	async function fetch_sign_up_data() {
		const response = await fetch(`${PUBLIC_SERVER_URL}/auth/signup`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password,
				name: name
			})
		});
		const status_code = response.status;
		console.log(status_code);
		if (status_code == 200) {
			console.log('ok');
			goto('/');
		} else if (status_code == 400) {
			is_create_success = false;
			error_message = 'Email already exists.';
		}
	}
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<section class="bg-gray-200">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
		<a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
			<img class="w-36 h-16 mr-2" src="/logo.png" alt="logo" />
		</a>
		<div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
					Create an account
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
						<label for="name" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
						<input
							type="name"
							name="name"
							id="name"
							placeholder=""
							bind:value={name}
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
					<div>
						<label for="password" class="block mb-2 text-sm font-medium text-gray-900"
							>Comfirm password</label
						>
						<input
							type="password"
							name="re_password"
							id="re_password"
							bind:value={re_password}
							class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							required={true}
						/>
					</div>
					<!--<div class="flex items-center justify-between">
                        
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                              <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 " required={true}>
                            </div>
                            <div class="ml-3 text-sm">
                              <label for="remember" class="text-gray-500 ">remember </label>
                            </div>
                        </div>
                        <a href="/error404" class="text-sm font-medium text-primary-600 hover:underline ">Forgot password?</a>
                    </div>-->
					{#if is_create_success == false}
						<div class="text-red-500">{error_message}</div>
					{/if}
					<button
						type="submit"
						onclick={create_account}
						class="w-full text-gray-100 bg-red-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
						>Create an account</button
					>
					<p class="text-sm font-light text-gray-700">
						Already have an account? <a
							href="/login"
							class="font-medium text-primary-600 hover:underline">Login here</a
						>
					</p>
				</form>
			</div>
		</div>
	</div>
</section>
