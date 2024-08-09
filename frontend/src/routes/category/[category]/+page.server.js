import { error } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';

const article_per_page = 5;

/**@type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params, url }) => {
	const categories = [
		'news',
		'economics',
		'science',
		'life-style',
		'culture',
		'sports',
		'technology',
		'art-gallery'
	];

	if (categories.includes(params.category)) {
		const currentPage = parseInt(url.searchParams.get('page') || '1');

		const skip = (currentPage - 1) * article_per_page;

		const [response_articles, response_authentication] = await Promise.all([
			fetch(
				`${PUBLIC_SERVER_URL}/article/get/${params.category}?limit=${article_per_page}&skip=${skip}`
			),
			fetch(`${PUBLIC_SERVER_URL}/auth`)
		]);

		const result = await response_articles.json();

		if (currentPage != 1 && (!result.articles || result.articles.length == 0)) {
			error(404, 'Article not found');
		}

		const isAuthenticated = response_authentication.status === 200;

		const totalPage = Math.ceil(result.total / article_per_page);

		return {
			latestArticles: result.latest,
			articles: result.articles,
			isAuthenticated,
			currentPage,
			totalPage
		};
	}

	error(404, 'Not Found');
};
