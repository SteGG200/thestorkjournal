import sql from '../db'

export const createNewArticle = async (userId : number, newArticle:  ArticleInfo) => {
	const article = await sql<{id: string}[]>`INSERT INTO unpublished_articles (user_id, title, thumbnail, category, content) 
	VALUES (${userId}, ${newArticle.title}, ${newArticle.thumbnail}, ${newArticle.category}, ${newArticle.content})
	RETURNING id`

	return article[0].id
}