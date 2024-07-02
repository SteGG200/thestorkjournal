import { FastifyPluginCallback } from "fastify";
import { createArticleRoute } from "./createArticle";
import { confirmArticleRoute } from "./confirm";

export const articleRoute : FastifyPluginCallback = (fastify, option, done) => {
	fastify.get('/', (req, res) => {
		res.send("This is article page.")
	})

	fastify.register(createArticleRoute, {
		prefix: '/new'
	})

	fastify.register(confirmArticleRoute, {
		prefix: '/confirm'
	})

	done()
}