import { FastifyPluginAsync } from "fastify";
import lucia from "./setup_auth";
import { isAuthenticated } from "../../utils/authentication";

export const logoutRoute: FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send("This is logout page.")
	})

	fastify.post('/', async (req, res) => {
		const user = await isAuthenticated(fastify, req)

		if(user === undefined) {
			res.statusCode = 401
			res.send({message: "Unauthorized"})
			return
		}

		await lucia.invalidateUserSessions(user.id);

		res.clearCookie(fastify.config.cookieName.sessionId)
		res.clearCookie(fastify.config.cookieName.user_info)

		res.statusCode = 200
		res.send({ message: "User logged out successfully" })
	})
}