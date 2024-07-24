import { FastifyPluginAsync } from 'fastify';
import { countArticles, getListArticles } from '../../database/articleHandler.js';

export const getArticleRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.get<{
		Querystring: QuerystringGetArticlesAPI;
	}>('/', async (req, res) => {
		const { limit, skip } = req.query;

		if (!limit || skip === undefined || skip === null) {
			res.statusCode = 404;
			res.send({ message: 'Missing required parameters' });
		}

		const articlesInfo = await getListArticles('', limit, skip);
		const latestArticlesInfo = await getListArticles('', fastify.config.limitLatestArticles, 0);
		const totalArticles = await countArticles('');

		res.statusCode = 200;
		res.send({ latest: latestArticlesInfo, articles: articlesInfo, total: totalArticles[0].count });
	});

	fastify.get<{
		Params: {
			category: string;
		};
		Querystring: QuerystringGetArticlesAPI;
	}>('/:category', async (req, res) => {
		const category = req.params.category;
		if (!fastify.config.articleCategories.includes(category)) {
			res.statusCode = 400;
			res.send({ message: 'Invalid category' });
			return;
		}

		const { limit, skip } = req.query;

		if (!limit || skip === undefined || skip === null) {
			res.statusCode = 404;
			res.send({ message: 'Missing required parameters' });
		}

		const articlesInfo = await getListArticles(category, limit, skip);
		const latestArticlesInfo = await getListArticles(
			category,
			fastify.config.limitLatestArticles,
			0
		);
		const totalArticles = await countArticles(category);

		res.statusCode = 200;
		res.send({ latest: latestArticlesInfo, articles: articlesInfo, total: totalArticles[0].count });
	});
};
