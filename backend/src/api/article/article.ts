import { FastifyPluginCallback } from "fastify";
import { createArticleRoute } from "./createArticle";
import { confirmArticleRoute } from "./confirm";
import { getArticleRoute } from "./getArticles";
import { showArticleRoute } from "./show";

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

	fastify.register(getArticleRoute, {
		prefix: '/get'
	})

	fastify.register(showArticleRoute, {
		prefix: '/show'
	})

	done()
}