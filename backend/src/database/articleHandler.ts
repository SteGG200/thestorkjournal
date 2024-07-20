import sql from './db.js';

export const createNewArticle = async (newArticle: UnconfirmedArticleInfo, key: string) => {
	const article = await sql<
		{ id: string }[]
	>`INSERT INTO unconfirmed_articles (user_id, title, thumbnail, category, content, key) 
	VALUES (${newArticle.user_id}, ${newArticle.title}, ${newArticle.thumbnail}, ${newArticle.category}, ${newArticle.content}, ${key})
	RETURNING id`;

	return article[0].id;
};

export const getUnconfirmedArticle = async (articleId: string, confirmKey: string) => {
	return await sql<
		UnconfirmedArticleInfo[]
	>`SELECT user_id, title, thumbnail, category, content FROM unconfirmed_articles
	WHERE id = ${articleId} AND key = ${confirmKey}`;
};

export const removeUnconfirmedArticle = async (
	articleId: string,
	confirmKey: string,
	authorId: number
) => {
	const deletedArticles = await sql`DELETE FROM unconfirmed_articles
	WHERE id = ${articleId} AND key = ${confirmKey} AND user_id = ${authorId}
	RETURNING id`;

	if (deletedArticles.length === 0) {
		return false;
	}

	return true;
};

export const confirmArticle = async (article: UnconfirmedArticleInfo) => {
	return await sql<
		{ id: string; datePublish: string }[]
	>`INSERT INTO articles (user_id, title, thumbnail, category, content) 
  VALUES (${article.user_id}, ${article.title}, ${article.thumbnail}, ${article.category}, ${article.content})
	RETURNING id, date_publish`;
};

export const getListArticles = async (category: string = '') => {
	if (category != '') {
		return await sql<
		ArticleInfo[]
		>`SELECT articles.date_publish, articles.title, articles.thumbnail, articles.category, articles.content, users.name 
		FROM articles, users 
		WHERE articles.user_id = users.id
		AND articles.category = ${category}
		ORDER BY date_publish DESC`;
	} else {
		return await sql<
		ArticleInfo[]
		>`SELECT articles.date_publish, articles.title, articles.thumbnail, articles.category, articles.content, users.name 
		FROM articles, users 
		WHERE articles.user_id = users.id 
		ORDER BY date_publish DESC`;
	}
};

export const getArticleById = async (articleId: string) => {
	return await sql<
		ArticleInfo[]
	>`SELECT articles.date_publish, articles.title, articles.thumbnail, articles.category, articles.content, users.name 
		FROM articles, users 
		WHERE articles.user_id = users.id
		AND articles.id = ${articleId}
		ORDER BY date_publish DESC`;
};

export const getArticleBySearch = async (query: string) => {
	const tempQuery = '%' + query + '%';
	return await sql<
	ArticleInfo[]
	>`SELECT articles.date_publish, articles.title, articles.thumbnail, articles.category, articles.content, users.name 
	FROM articles, users
	WHERE articles.user_id = users.id
	AND (title LIKE ${tempQuery} OR content LIKE ${tempQuery})
	ORDER BY date_publish DESC`;
};
