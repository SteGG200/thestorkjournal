import { error } from "@sveltejs/kit";
import { PUBLIC_SERVER_URL } from '$env/static/public'

export const load  = async ({ fetch, params }) => {
	const categories = [
		'news',
		'economics',
		'science',
		'life-style',
		'fashion',
		'sports',
		'technology',
		'art-gallery'
	];

	if(categories.includes(params.category)){
		const [response_articles, response_authentication] = await Promise.all([
			fetch(`${PUBLIC_SERVER_URL}/article/get/${params.category}`),
			fetch(`${PUBLIC_SERVER_URL}/auth`, { credentials: 'include' })
		])
	
		const result = await response_articles.json()
	
		const isAuthenticated = response_authentication.status === 200
	
		return { articles: result.articles, isAuthenticated};
	}

	error(404, 'Not Found');
}