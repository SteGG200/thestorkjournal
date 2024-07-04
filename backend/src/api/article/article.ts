import { FastifyPluginCallback } from "fastify";
import { createArticleRoute } from "./createArticle.js";
import { confirmArticleRoute } from "./confirm.js";
import { getArticleRoute } from "./getArticles.js";
import { showArticleRoute } from "./show.js";
import { searchArticlesRoute } from "./search.js";

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

	fastify.register(searchArticlesRoute, {
		prefix: '/search'
	})

	done()
}