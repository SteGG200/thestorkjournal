import { error } from '@sveltejs/kit';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { PUBLIC_SERVER_URL } from '$env/static/public';

/**
 * 
 * @param {string} uuid 
 * @returns {boolean} 
 */
function uuidValidateV4(uuid) {
	return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	if (uuidValidateV4(params.articleId)) {
		const [response_article, response_authentication] = await Promise.all([
			fetch(`${PUBLIC_SERVER_URL}/article/show/${params.articleId}`),
			fetch(`${PUBLIC_SERVER_URL}/auth`, { credentials: 'include' })
		]);

		if (response_article.status === 404) {
			error(404, 'Article not found');
		}

		const result = await response_article.json();

		const isAuthenticated = response_authentication.status === 200;

		return {
			article: result.article,
			authorName: result.authorName,
			isAuthenticated: isAuthenticated
		};
	}

	error(404, 'Not Found');
}
