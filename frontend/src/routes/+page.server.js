import { PUBLIC_SERVER_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

const article_per_page = 5;

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, url }) {
	const currentPage = parseInt(url.searchParams.get('page') ?? '1');

	const skip = (currentPage - 1) * article_per_page;

	const [response_articles, response_authentication] = await Promise.all([
		fetch(`${PUBLIC_SERVER_URL}/article/get?limit=${article_per_page}&skip=${skip}`),
		fetch(`${PUBLIC_SERVER_URL}/auth`)
	]);

	const result = await response_articles.json();

	if (!result.articles || result.articles.length == 0) {
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
