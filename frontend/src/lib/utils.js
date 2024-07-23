export const suggestArticles = (articles, limit_suggested_article) => {
	const length = articles.length;
	if (length <= limit_suggested_article) {
		return articles;
	}
	return articles.slice(0, limit_suggested_article);
};

export function formatCategory(string) {
	string = string.replace('-', ' ');
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function take_first_para(blocks){
    const length = blocks.length;
    for (let i=0;i<length;++i){
        if (blocks[i].type=="paragraph"){
            return blocks[i].data.text;
            // return "idk test first";
        }
    }
    return "";
}
