import { FastifyPluginAsync } from 'fastify';
import { getListArticles } from '../../database/articleHandler.js';

export const getArticleRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', async (req, res) => {
		const articlesInfo = await getListArticles();

		res.statusCode = 200;
		res.send({ articles: articlesInfo });
	});

	fastify.get<{
		Params: {
			category: string;
		};
	}>('/:category', async (req, res) => {
		const category = req.params.category;
		if (!fastify.config.articleCategories.includes(category)) {
			res.statusCode = 400;
			res.send({ message: 'Invalid category' });
			return;
		}

		const articlesInfo = await getListArticles(category);

		res.statusCode = 200;
		res.send({ articles: articlesInfo });
	});
};
