import { PUBLIC_SERVER_URL } from '$env/static/public';
/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch(`${PUBLIC_SERVER_URL}/article/get`);
	const result = await response.json();
	return result;
}
