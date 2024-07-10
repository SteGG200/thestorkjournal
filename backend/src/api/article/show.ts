import { FastifyPluginAsync } from 'fastify';
import { uuidValidateV4 } from '../../utils/articleIdHandler.js';
import { getArticleById } from '../../database/articleHandler.js';
import { getUserById } from '../../database/userHandler.js';

export const showArticleRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.get<{
		Params: {
			articleId: string;
		};
	}>('/:articleId', async (req, res) => {
		const articleId = req.params.articleId;

		if (!uuidValidateV4(articleId)) {
			res.statusCode = 400;
			res.send({ message: 'Invalid article ID' });
			return;
		}

		const articleInfo = await getArticleById(articleId);

		if (articleInfo.length === 0) {
			res.statusCode = 404;
			res.send({ message: 'Article not found' });
			return;
		}

		const authorInfo = await getUserById(articleInfo[0].user_id);

		res.statusCode = 200;
		res.send({
			article: {
				datePublish: articleInfo[0].date_publish,
				title: articleInfo[0].title,
				thumbnail: articleInfo[0].thumbnail,
				category: articleInfo[0].category,
				content: articleInfo[0].content
			},
			author: authorInfo
		});
	});
};
