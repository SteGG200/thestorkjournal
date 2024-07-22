export const suggestArticles = (articles, limit_suggested_article) => {
	const length = articles.length
	if(length <= limit_suggested_article){
		return articles
	} 
	return articles.slice(0, limit_suggested_article)
}

export function formatCategory(string) {
	string = string.replace('-', ' ')
	return string.charAt(0).toUpperCase() + string.slice(1);
}