import { FastifyPluginCallback } from "fastify";
import { createArticleRoute } from "./createArticle";

export const articleRoute : FastifyPluginCallback = (fastify, option, done) => {
	fastify.get('/', (req, res) => {
		res.send("This is article page.")
	})

	fastify.register(createArticleRoute, {
		prefix: '/new'
	})

	done()
}