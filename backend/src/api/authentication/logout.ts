import { FastifyPluginAsync } from 'fastify';
import lucia from './setup_auth.js';
import { isAuthenticated } from '../../utils/authentication.js';
import { getUserInfoCookie } from '../../utils/cookieHandler.js';

export const logoutRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send('This is logout page.');
	});

	fastify.post('/', async (req, res) => {
		const authentication = await isAuthenticated(fastify, req);

		if (!authentication) {
			res.statusCode = 401;
			res.send({ message: 'Unauthorized' });
			return;
		}

		const userInfo = getUserInfoCookie(req.cookies[fastify.config.cookieName.userInfo] as string);

		await lucia.invalidateUserSessions(userInfo.id);

		await lucia.deleteExpiredSessions();

		res.cookie(fastify.config.cookieName.sessionId, '');
		res.cookie(fastify.config.cookieName.userInfo, '');

		res.statusCode = 200;
		res.send({ message: 'User logged out successfully' });
	});
};
