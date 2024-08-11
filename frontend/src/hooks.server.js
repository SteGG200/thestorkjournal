import { PUBLIC_SERVER_URL } from '$env/static/public';

/**@type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ event, request, fetch }){
	const cookies = event.request.headers.get('cookie')
	if(request.url.startsWith(`${PUBLIC_SERVER_URL}/auth`) && cookies){
		request.headers.set('cookie', cookies);
	}

	return fetch(request, { credentials: 'include'})
}