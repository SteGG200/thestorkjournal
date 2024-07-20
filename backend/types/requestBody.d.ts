interface BodyLoginAPI {
	email: string;
	password: string;
}

interface BodySignupAPI extends BodyLoginAPI {
	name: string;
}

interface BodyCreateArticleAPI {
	title: string;
	thumbnail: string;
	content: string;
	category: string;
}

interface BodyConfirmArticleAPI {
	confirmKey: string;
	article: BodyCreateArticleAPI;
	authorId: number;
	confirmStatus: boolean;
}