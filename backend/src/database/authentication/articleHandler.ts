import sql from '../db'

export const createNewArticle = async (userId : number, newArticle:  ArticleInfo, key: string) => {
	const article = await sql<{id: string}[]>`INSERT INTO unconfirmed_articles (user_id, title, thumbnail, category, content, key) 
	VALUES (${userId}, ${newArticle.title}, ${newArticle.thumbnail}, ${newArticle.category}, ${newArticle.content}, ${key})
	RETURNING id`

	return article[0].id
}