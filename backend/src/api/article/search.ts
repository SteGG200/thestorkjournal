import { FastifyPluginAsync } from 'fastify';
import { getArticleBySearch } from '../../database/articleHandler.js';

export const searchArticlesRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.post<{
		Body: {
			query: string;
		};
	}>('/', async (req, res) => {
		const query = req.body.query;

		if (!query) {
			res.statusCode = 400;
			res.send({ message: 'Invalid query' });
			return;
		}

		const articlesInfo = await getArticleBySearch(query);

		res.statusCode = 200;
		res.send({ articles: articlesInfo });
	});
};
