import { FastifyPluginAsync } from "fastify";
import { getUserInfoCookie } from "../../utils/cookieHandler";
import { isAuthenticated } from "../../utils/authentication";
import { createNewArticle } from "../../database/authentication/articleHandler";
import transporter from "../../utils/emailHandler";

export const createArticleRoute : FastifyPluginAsync = async (fastify, option) => {
	fastify.get('/', (req, res) => {
		res.send("This is the page for creating new article.")
	})

	fastify.post<{
		Body: ArticleInfo
	}>('/', async (req, res) => {
		const authentication = await isAuthenticated(fastify, req)

		if(!authentication) {
			res.statusCode = 401
      res.send({message: "Unauthorized"})
      return
		}

		const article = req.body

		const authorInfo = getUserInfoCookie(req.cookies[fastify.config.cookieName.userInfo] as string)

		const articleId = await createNewArticle(authorInfo.id, article)

		transporter.sendMail({
			from: process.env.EMAIL_ADMIN,
			to: process.env.EMAIL_ADMIN,
      subject: "New Article Created",
      text: `A new article has been created by ${authorInfo.name} with email ${authorInfo.email}.\n\nThe ID of the article is ${articleId}. Use it to publish the article as soon as you can.\n\nThank you!`
		})

		res.statusCode = 200
		res.send({message: "Article is created successfully and waiting for publication"})
	})
}