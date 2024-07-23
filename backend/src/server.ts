import fastify from 'fastify';
import cookiePlugin from '@fastify/cookie';
import multipartPlugin from '@fastify/multipart';
import middlewarePlugin from '@fastify/middie';
import cors from 'cors';
import xXssProtection from 'x-xss-protection';

import { authenticationRoute } from './api/authentication/authentication.js';
import lucia from './api/authentication/setup_auth.js';
import { articleRoute } from './api/article/article.js';
import { uploadImageRoute } from './uploadImage.js';

const server = fastify({
	logger: true,
	bodyLimit: 4194304
});

server.decorate('config', {
	port: Number(process.env.PORT ?? '3000'),
	cookieName: {
		sessionId: lucia.sessionCookieName,
		userInfo: 'iuser'
	},
	articleCategories: [
		'news',
		'economics',
		'science',
		'life-style',
		'fashion',
		'sports',
		'technology',
		'art-gallery'
	],
	limitLatestArticles: 5
});

server.get('/', (req, res) => {
	res.send('This is a test server');
});

const pluginsRegister = async () => {
	server.register(cookiePlugin, {
		secret: process.env.COOKIE_SECRET,
		parseOptions: {
			maxAge: 172800,
			path: '/',
			sameSite: 'none',
			secure: true
		}
	});

	server.register(multipartPlugin);

	await server.register(middlewarePlugin);

	server.use(
		cors({
			origin: process.env.CLIENT_URL ?? '*',
			credentials: true,
			methods: ['GET', 'POST']
		})
	);

	server.use(xXssProtection());

	server.register(authenticationRoute, {
		prefix: '/auth'
	});

	server.register(articleRoute, {
		prefix: '/article'
	});

	server.register(uploadImageRoute, {
		prefix: '/upload'
	});
};

const startServer = async () => {
	try {
		await pluginsRegister();
		server.listen({ port: server.config.port, host: '0.0.0.0' }, (err, address) => {
			server.log.info(`Server listening at ${address}`);
		});
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

startServer();
