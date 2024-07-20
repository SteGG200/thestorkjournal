import { FastifyPluginAsync } from 'fastify';
import { getUserInfoCookie } from '../../utils/cookieHandler.js';
import { isAuthenticated } from '../../utils/authentication.js';
import { createNewArticle } from '../../database/articleHandler.js';
import transporter from '../../utils/emailHandler.js';
import crypto from 'crypto';

export const createArticleRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send('This is the page for creating new article.');
	});

	fastify.post<{
		Body: BodyCreateArticleAPI;
	}>('/', async (req, res) => {
		const authentication = await isAuthenticated(fastify, req);

		if (!authentication) {
			res.statusCode = 401;
			res.send({ message: 'Unauthorized' });
			return;
		}

		const article = req.body;

		if (!article.title || !article.thumbnail || !article.category || !article.content) {
			res.statusCode = 400;
			res.send({ message: 'Invalid article information' });
			return;
		}

		const authorInfo = getUserInfoCookie(req.cookies[fastify.config.cookieName.userInfo] as string);

		const confirmKey = crypto.randomBytes(32).toString('base64');

		const articleId = await createNewArticle({user_id: authorInfo.id, ...article}, confirmKey);

		transporter.sendMail({
			from: process.env.EMAIL_ADMIN,
			to: process.env.EMAIL_ADMIN,
			subject: 'New Article Created',
			text: `A new article has been created by ${authorInfo.name} with email ${authorInfo.email}.\n\nThe ID of the article is ${articleId}. Using the key below to confirm the article as soon as you can.\n\nThis is the key: ${confirmKey}\n\nThank you!`
		});

		res.statusCode = 200;
		res.send({ message: 'Article is created successfully and waiting for publication' });
	});
};
