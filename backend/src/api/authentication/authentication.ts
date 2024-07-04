import { FastifyPluginAsync } from "fastify";
import { loginRoute } from "./login.js";
import { logoutRoute } from "./logout.js";
import { isAuthenticated } from "../../utils/authentication.js";
import { signupRoute } from "./signup.js";
import { getUserInfoCookie } from "../../utils/cookieHandler.js";

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