import { FastifyInstance, FastifyRequest } from 'fastify';
import lucia from '../api/authentication/setup_auth.js';
import { getUserInfoCookie } from './cookieHandler.js';

export const isAuthenticated = async (fastify: FastifyInstance, req: FastifyRequest) => {
	const cookieHeader = req.headers.cookie;
	const sessionId = lucia.readSessionCookie(cookieHeader ?? '');

	if (!sessionId) return false;

	const { session, user } = await lucia.validateSession(sessionId);

	if (!session || !user) return false;

	const tokenUserInfo = req.cookies[fastify.config.cookieName.userInfo];

	if (!tokenUserInfo) {
		return false;
	}

	const userInfoCookie = getUserInfoCookie(tokenUserInfo);

	if (userInfoCookie.id == user.id) {
		return true;
	}

	return false;
};
