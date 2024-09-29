interface ContentBlock {
	id: string
}

interface BlockParagraph extends ContentBlock {
	type: "paragraph"
	data: {
		text: string
	}
}

interface BlockImage extends ContentBlock {
	type: "image"
	data: {
		file: {
			url: string
		}
		[key: string] : any
	}
}

interface ArticleContent {
	time: number
	blocks: (BlockParagraph | BlockImage)[]
	version: string
	[key: string]: any
}

interface Article {
	title: string;
	thumbnail: string;
	content: ArticleContent
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
