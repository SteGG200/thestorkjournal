import { FastifyPluginAsync } from "fastify";
import { confirmArticle, getUnconfirmedArticle, removeUnconfirmedArticle } from "../../database/articleHandler.js";
import validate from 'uuid-validate'
import { getUserById } from "../../database/userHandler.js";
import transporter from "../../utils/emailHandler.js";

export const confirmArticleRoute : FastifyPluginAsync = async (fastify, option) => {
	fastify.post<{
		Params: {
			articleId : string
		},
		Body: BodyConfirmArticleAPI
	}>('/:articleId/get', async (req, res) => {

		const articleId = req.params.articleId;
		if(!validate(articleId)){
			res.statusCode = 400
      res.send({message: "Invalid article ID"})
      return
		}

		const confirmKey = req.body.confirmKey;
		if(!confirmKey){
			res.statusCode = 400
      res.send({message: "Invalid confirm key"})
      return
		}

		const articleInfo = await getUnconfirmedArticle(articleId, confirmKey)
		if(articleInfo.length === 0) {
      res.statusCode = 401
      res.send({message: "Unauthorized"})
      return
    }

		res.statusCode = 200
		res.send({authorId: articleInfo[0].user_id, article: {
			title: articleInfo[0].title,
      thumbnail: articleInfo[0].thumbnail,
      content: articleInfo[0].content,
      category: articleInfo[0].category,
		}, message: "Get article successfully"})
	})

	fastify.post<{
		Params: {
			articleId : string
		}
		Body: BodyConfirmArticleAPI
	}>('/:articleId', async (req, res) => {

		const articleId = req.params.articleId
		
		if(!validate(articleId)) {
			res.statusCode = 400
			res.send({message: "Invalid article ID"})
			return
		}

		const {article , confirmKey, authorId, confirmStatus} = req.body

		if(!article.title || !article.thumbnail || !article.content || !article.category || !confirmKey || confirmStatus === undefined) {
			res.statusCode = 400
      res.send({message: "Invalid input"})
      return
		}

		const checkRemoveUnconfirmedArticle = await removeUnconfirmedArticle(articleId, confirmKey, article, authorId)

		if(!checkRemoveUnconfirmedArticle) {
			res.statusCode = 403
			res.send({message: "Forbidden!"})
			return
		}

		const authorInfo = await getUserById(authorId)

		transporter.sendMail({
			from: process.env.EMAIL_ADMIN,
			to: authorInfo.email,
			subject: `Your article was ${confirmStatus ? "confirmed successfully" : "rejected"}`,
      text: `${confirmStatus ? `Your article was successfully confirmed by admin and published on our website.\n\nYou can see it by enter following link:\n\n${process.env.CLIENT_URL}` : ""}`
		})

		if(confirmStatus){
			await confirmArticle(article, authorId)
			res.statusCode = 200
			res.send({message: "Article is confirmed successfully"})
			return
		}


		res.statusCode = 200
		res.send({message: "Article is rejected successfully"})
	})
}