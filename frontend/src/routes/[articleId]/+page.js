import { error } from '@sveltejs/kit'
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { PUBLIC_SERVER_URL } from '$env/static/public'

function uuidValidateV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

/** @type {import('./$types').PageLoad} */
export async function load({ params }){
	if(uuidValidateV4(params.articleId)){
		const response = await fetch(`${PUBLIC_SERVER_URL}/article/show/${params.articleId}`)
		const result = await response.json()
		return result;
	}

	error(404, 'Not Found');
}