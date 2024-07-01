import { FastifyPluginAsync, FastifyPluginCallback} from "fastify";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { isAuthenticated } from "../../utils/authentication";

export const authenticationRoute : FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', async (req, res) => {
		const userPossible = await isAuthenticated(req)
		if(!userPossible) {
			res.statusCode = 401;
			res.send({message: "User is not authenticated"})
			return
		}
		res.statusCode = 200;
		res.send({message: `Hello, ${userPossible.name}`})
	})

	fastify.register(loginRoute,{
		prefix: '/login'
	})

	fastify.register(logoutRoute, {
		prefix: '/logout'
	})
}