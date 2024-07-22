import { error } from "@sveltejs/kit";
import { PUBLIC_SERVER_URL } from '$env/static/public'

export const load  = async ({ fetch, params }) => {
	const categories = [
		'news',
		'economics',
		'science',
		'life-style',
		'fashion',
		'sports',
		'technology',
		'art-gallery'
	];

	if(categories.includes(params.category)){
		const response = await fetch(`${PUBLIC_SERVER_URL}/article/get/${params.category}`);
		const result = await response.json();
    return {
			result,
			category: params.category
		};
	}

	error(404, 'Not Found');
}