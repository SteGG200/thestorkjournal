import "fastify"
import "lucia"
import lucia from "../src/api/authentication/setup_auth";

declare global{
  interface BodyLoginAPI{
    email: string,
    password: string,
  }

  interface BodySignupAPI extends BodyLoginAPI{
    name: string,
  }

  interface ArticleInfo{
    title: string,
    thumbnail: string,
    content: string,
    category: string,
  }

  interface UserProfileSchema{
    id: number,
    created_at: Date,
    name: string,
    email: string,
    password: string,
  }
}

declare module 'fastify' {
  interface FastifyInstance{
    config: {
      port: number,
      cookieName: {
        sessionId: string,
        userInfo: string
      }
    }
  }
}

declare module "lucia" {
	interface Register {
    UserId: number,
		Lucia: typeof lucia,
    DatabaseUserAttributes: UserAttributes,
	}
}

interface UserAttributes{
  name: string;
  email: string;
}