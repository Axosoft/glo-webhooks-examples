import fetch from 'node-fetch';
import { urlWithParam, GET_GLO } from '../utils/url.mjs';

const baseUrl = 'https://gloapi.gitkraken.com/v1/glo/boards';

const boardFieldParams = [
	['fields', 'columns'],
	['fields', 'members'],
	['fields', 'name'],
];

export const BoardService = {
	getAll: () => fetch(urlWithParam(`${baseUrl}`, boardFieldParams), GET_GLO).then((response) => response.json()),
	getById: (boardId) =>
		fetch(urlWithParam(`${baseUrl}/${boardId}`, boardFieldParams), GET_GLO).then((response) => response.json()),
};
