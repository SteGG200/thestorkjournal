import sql from './db'

export const createNewArticle = async (userId : number, newArticle:  ArticleInfo, key: string) => {
	const article = await sql<{id: string}[]>`INSERT INTO unconfirmed_articles (user_id, title, thumbnail, category, content, key) 
	VALUES (${userId}, ${newArticle.title}, ${newArticle.thumbnail}, ${newArticle.category}, ${newArticle.content}, ${key})
	RETURNING id`

	return article[0].id
}

export const getUnconfirmedArticle = async (articleId: string, confirmKey: string) => {
	return await sql<ArticleInfoSchema[]>`SELECT user_id, title, thumbnail, category, content FROM unconfirmed_articles
	WHERE id = ${articleId} AND key = ${confirmKey}`
}

export const removeUnconfirmedArticle = async (articleId: string, confirmKey: string, article: ArticleInfo, authorId: number) => {
	const deletedArticles = await sql`DELETE FROM unconfirmed_articles
	WHERE id = ${articleId} AND key = ${confirmKey} AND user_id = ${authorId}
	RETURNING id`

	if (deletedArticles.length === 0){
		return false
	}

	return true
}

export const confirmArticle = async (article: ArticleInfo, authorId: number) => {
	await sql`INSERT INTO articles (user_id, title, thumbnail, category, content) 
  VALUES (${authorId}, ${article.title}, ${article.thumbnail}, ${article.category}, ${article.content})`

}

export const getArticles = async (category: string = "") => {
	if(category != ""){
		return await sql`SELECT * FROM articles WHERE category = ${category}`
	}else{
		return await sql`SELECT * FROM articles`
	}
}