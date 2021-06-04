import fetch from 'node-fetch';

const baseUrl = (board) => `https://gloapi.gitkraken.com/v1/glo/boards/${board}/cards`;

const cardFieldsParam = [
	['fields', 'assignees'],
	['fields', 'board_id'],
	['fields', 'column_id'],
	['fields', 'created_by'],
	['fields', 'created_date'],
	['fields', 'due_date'],
	['fields', 'description'],
	['fields', 'labels'],
	['fields', 'name'],
	['fields', 'milestone'],
];

const CardService = {
	getAll: (board) =>
		fetch(urlWithParam(`${baseUrl(board)}`, cardFieldsParam), GET_GLO).then((response) => response.json()),
	getById: (board, cardId) =>
		fetch(urlWithParam(`${baseUrl(board)}/${cardId}`, cardFieldsParam), GET_GLO).then((response) =>
			response.json()
		),
};
