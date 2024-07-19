import { PUBLIC_SERVER_URL } from '$env/static/public';
/** @type {import('./$types').PageLoad} */
export async function load({fetch}) {
    const res = await fetch(`${PUBLIC_SERVER_URL}/article/get`);
    const item = await res.json();
    return { item }
}