import { URL, URLSearchParams } from 'url';
import { gloHeader } from '../config/config.mjs';

export const urlWithParam = (url, params) => {
	const myUrl = new URL(url);
	myUrl.search = new URLSearchParams(params).toString();
	return myUrl;
};

export const GET_GLO = { method: 'GET', headers: gloHeader, mode: 'cors', cache: 'default' };

export const POST_GLO = { method: 'POST', headers: gloHeader, mode: 'cors', cache: 'default' };

export const POST_DISCORD = (data) => ({
	method: 'POST',
	headers: {
		'Content-type': 'application/json',
	},
	mode: 'cors',
	cache: 'default',
	body: JSON.stringify(data),
});
