import { FastifyPluginCallback } from "fastify";

export const articleRoute : FastifyPluginCallback = (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send("This is article page.")
	})
}