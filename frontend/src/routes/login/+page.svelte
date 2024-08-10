<script>
	import '../../app.css';
	import Button from '$components/Button.svelte';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { goto } from '$app/navigation'
	import { page } from '$app/stores';
	import { z } from 'zod'

	let email = $state('')
	/**@type {string | null}*/
	let error = $state(null)
	let isPending = $state(false);
	let redirectUrl = $page.url.searchParams.get('redirect')

  const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string()
  })

	/** @param {{ currentTarget: EventTarget & HTMLFormElement}} event */
	const handleSubmit = async (event) => {
		isPending = true
		const data = new FormData(event.currentTarget)

		const dataJson = Object.fromEntries(data.entries())

		const validation = loginSchema.safeParse(dataJson)

		if(!validation.success){
			error = validation.error.issues[0].message
			isPending = false
			return
		}

		const response = await fetch(`${PUBLIC_SERVER_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataJson),
			credentials: 'include'
		})

		const result = await response.json()

		if(!response.ok){
			error = result.message
			isPending = false
			return
		}

		const listApprovedRedirects = ['/', '/text-editor']
		
		if(!redirectUrl || !listApprovedRedirects.includes(redirectUrl)){
			redirectUrl = '/'
		}

		goto(redirectUrl)
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<section class="bg-gray-200">
	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh lg:py-0">
		<a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
			<img class="w-36 h-16 mr-2" src="/logo.png" alt="logo" />
		</a>
		<div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
					Sign in to your account
				</h1>
				<form class="space-y-4 md:space-y-6" onsubmit={handleSubmit}>
					<div>
						<label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							bind:value={email}
							class="bg-gray-50 border border-gray-300 text-gray-900 disabled:text-gray-500 rounded-lg block w-full p-2.5"
							required
							disabled={isPending}
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
							class="bg-gray-50 border border-gray-300 text-gray-900 disabled:text-gray-500 rounded-lg block w-full p-2.5"
							required
							disabled={isPending}
						/>
					</div>

					{#if error}
						<div class="text-red-500">{error}</div>
					{/if}
					<Button
						type="submit"
						className="w-full text-gray-100 bg-red-700 hover:bg-red-750 disabled:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
						isPending={isPending}
					>
						Sign in
					</Button>
					<p class="text-sm font-light text-gray-700">
						Don’t have an account yet?
						<a href="/signup" class="font-medium text-primary-600 hover:underline">Sign up</a>
					</p>
				</form>
			</div>
		</div>
	</div>
</section>
