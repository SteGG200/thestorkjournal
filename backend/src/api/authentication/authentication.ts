import { FastifyPluginCallback} from "fastify";
import { loginRount } from "./login";

export const authenticationRoute : FastifyPluginCallback = (fastify, option, done) => {
	fastify.get('/', (req, res) => {
		res.send("This is authentication page.")
	})

	fastify.register(loginRount,{
		prefix: '/login'
	})

	done()
}