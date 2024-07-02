import sql from './db'

export const createNewArticle = async (userId : number, newArticle:  ArticleInfo, key: string) => {
	const article = await sql<{id: string}[]>`INSERT INTO unconfirmed_articles (user_id, title, thumbnail, category, content, key) 
	VALUES (${userId}, ${newArticle.title}, ${newArticle.thumbnail}, ${newArticle.category}, ${newArticle.content}, ${key})
	RETURNING id`

	return article[0].id
}

export const getUnconfirmedArticle = async (articleId: string, confirmKey: string) => {
	return await sql<UnconfirmedArticleInfoSchema[]>`SELECT user_id, title, thumbnail, category, content FROM unconfirmed_articles
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

export const getListArticles = async (category: string = "") => {
	if(category != ""){
		return await sql<ArticleInfoSchema[]>`SELECT date_publish, title, thumbnail, category, content FROM articles 
		WHERE category = ${category}
		ORDER BY date_publish DESC`
	}else{
		return await sql<ArticleInfoSchema[]>`SELECT date_publish, title, thumbnail, category, content FROM articles
		ORDER BY date_publish DESC`
	}
}

export const getArticleById = async (articleId: string) => {
	return await sql<ArticleInfoSchema[]>`SELECT date_publish, user_id, title, thumbnail, category, content FROM articles WHERE id = ${articleId}`
}

export const getArticleBySearch = async (query: string) => {
	const tempQuery = "%" + query + "%"
	return await sql<ArticleInfoSchema[]>`SELECT date_publish, title, thumbnail, category, content FROM articles
	WHERE title LIKE ${tempQuery} OR content LIKE ${tempQuery}`
}