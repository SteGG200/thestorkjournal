interface Article{
	title: string;
	thumbnail: string;
	content: string;
	category: string;
}

interface UnconfirmedArticleInfo extends Article {
	user_id: number;
}

interface ArticleInfo extends Article {
	date_publish: string;
	name: string;
	id: string;
}