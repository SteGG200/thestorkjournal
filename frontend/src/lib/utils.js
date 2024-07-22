export const suggestArticles = (articles, limit_suggested_article) => {
	const length = articles.length
	if(length <= limit_suggested_article){
		return articles
	} 
	return articles.slice(0, limit_suggested_article)
}