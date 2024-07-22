import { PUBLIC_SERVER_URL } from '$env/static/public';
/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const [response_articles, response_authentication] = await Promise.all([
		fetch(`${PUBLIC_SERVER_URL}/article/get`),
    fetch(`${PUBLIC_SERVER_URL}/auth`, { credentials: 'include' })
	])

	const result = await response_articles.json()

	const isAuthenticated = response_authentication.status === 200

	return { articles: result.articles, isAuthenticated};
}