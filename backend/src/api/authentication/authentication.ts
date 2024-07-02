import { FastifyPluginAsync, FastifyPluginCallback} from "fastify";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { isAuthenticated } from "../../utils/authentication";
import { signupRoute } from "./signup";
import { getUserInfoCookie } from "../../utils/cookieHandler";

export const authenticationRoute : FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', async (req, res) => {
		const authentication = await isAuthenticated(fastify, req)
		if(!authentication) {
			res.statusCode = 401;
			res.send({message: "User is not authenticated"})
			return
		}

		const userInfo = getUserInfoCookie(req.cookies[fastify.config.cookieName.userInfo] as string)

		res.statusCode = 200;
		res.send({message: `Hello, ${userInfo.name}`})
	})

	fastify.register(signupRoute, {
		prefix: '/signup'
	})

	fastify.register(loginRoute,{
		prefix: '/login'
	})

	fastify.register(logoutRoute, {
		prefix: '/logout'
	})
}