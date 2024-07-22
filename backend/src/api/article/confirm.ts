import { FastifyPluginAsync } from 'fastify';
import {
	confirmArticle,
	getUnconfirmedArticle,
	removeUnconfirmedArticle
} from '../../database/articleHandler.js';
import { uuidValidateV4 } from '../../utils/articleIdHandler.js';
import { getUserById } from '../../database/userHandler.js';
import transporter from '../../utils/emailHandler.js';

export const confirmArticleRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.post<{
		Params: {
			articleId: string;
		};
		Body: BodyConfirmArticleAPI;
	}>('/:articleId/get', async (req, res) => {
		const articleId = req.params.articleId;
		if (!uuidValidateV4(articleId)) {
			res.statusCode = 400;
			res.send({ message: 'Invalid article ID' });
			return;
		}

		const confirmKey = req.body.confirmKey;
		if (!confirmKey) {
			res.statusCode = 400;
			res.send({ message: 'Invalid confirm key' });
			return;
		}

		const articleInfo = await getUnconfirmedArticle(articleId, confirmKey);
		if (articleInfo.length === 0) {
			res.statusCode = 401;
			res.send({ message: 'Unauthorized' });
			return;
		}

		res.statusCode = 200;
		res.send({
			authorId: articleInfo[0].user_id,
			article: {
				title: articleInfo[0].title,
				thumbnail: articleInfo[0].thumbnail,
				content: articleInfo[0].content,
				category: articleInfo[0].category
			},
			message: 'Get article successfully'
		});
	});

	fastify.post<{
		Params: {
			articleId: string;
		};
		Body: BodyConfirmArticleAPI;
	}>('/:articleId', async (req, res) => {
		const articleId = req.params.articleId;

		if (!uuidValidateV4(articleId)) {
			res.statusCode = 400;
			res.send({ message: 'Invalid article ID' });
			return;
		}

		const { article, confirmKey, authorId, confirmStatus } = req.body;

		if (
			!article.title ||
			!article.thumbnail ||
			!article.content ||
			!article.category ||
			!confirmKey ||
			confirmStatus === undefined
		) {
			res.statusCode = 400;
			res.send({ message: 'Invalid input' });
			return;
		}

		const checkRemoveUnconfirmedArticle = await removeUnconfirmedArticle(
			articleId,
			confirmKey,
			authorId
		);

		if (!checkRemoveUnconfirmedArticle) {
			res.statusCode = 403;
			res.send({ message: 'Forbidden!' });
			return;
		}

		const authorInfo = await getUserById(authorId);

		if (confirmStatus) {
			const { id, datePublish } = (await confirmArticle({ user_id: authorId, ...article }))[0];

			transporter.sendMail({
				from: process.env.EMAIL_ADMIN,
				to: authorInfo.email,
				subject: 'Your article was confirmed successfully',
				text: `Your article was successfully confirmed by admin and published on our website at ${datePublish}.\n\nYou can see it by enter following link:\n\n${process.env.CLIENT_URL}/${id}`
			});

			res.statusCode = 200;
			res.send({ message: 'Article is confirmed successfully' });
			return;
		}

		transporter.sendMail({
			from: process.env.EMAIL_ADMIN,
			to: authorInfo.email,
			subject: 'Your article was rejected',
			text: ''
		});

		res.statusCode = 200;
		res.send({ message: 'Article is rejected successfully' });
	});
};
