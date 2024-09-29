import 'fastify';
import 'lucia';
import lucia from '../src/api/authentication/setup_auth';

declare module 'fastify' {
	interface FastifyInstance {
		config: {
			port: number;
			cookieName: {
				sessionId: string;
				userInfo: string;
			};
			articleCategories: string[];
			limitLatestArticles: number;
		};
	}
}

declare module 'lucia' {
	interface Register {
		UserId: number;
		Lucia: typeof lucia;
		DatabaseUserAttributes: UserAttributes;
	}
}

interface UserAttributes {
	name: string;
	email: string;
}
