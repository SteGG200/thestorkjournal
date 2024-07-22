import 'fastify';
import 'lucia';
import lucia from '../src/api/authentication/setup_auth';

declare global {
	// interface ArticleInfo {
	// 	title: string;
	// 	thumbnail: string;
	// 	content: string;
	// 	category: string;
	// }
	// interface ArticleInfo extends UnconfirmedArticleInfo {
	// 	date_publish: string;
	// }
}

declare module 'fastify' {
	interface FastifyInstance {
		config: {
			port: number;
			cookieName: {
				sessionId: string;
				userInfo: string;
			};
			articleCategories: string[];
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
