import { FastifyPluginCallback } from "fastify";

export const authenticationRoute : FastifyPluginCallback = (fastify, option, done) => {
	fastify.get('/', (req, res) => {
		res.send("This is authentication page.")
	})

	done()
}