import { BoardService } from '../api/board.mjs';
import { DiscordService } from './discord.mjs';

const getUserById = async (boardId, userId) =>
	await BoardService.getById(boardId).then(({ members }) =>
		members.filter((a) => a.id === userId).map((a) => a.name || a.username)
	);
const getColumnById = async (boardId, columnId) =>
	await BoardService.getById(boardId).then(({ columns }) =>
		columns.filter((a) => a.id === columnId).map((a) => a.name)
	);

export const postWebHook = async (req, res) => {
	console.log('Received Glo webhook payload', new Date());
	console.log('Event', req.headers['x-gk-event']);
	console.log(req.body);
	const action = req.body.action;
	console.log('action', action);

	const assigneesActionsToMap = [
		'added',
		'updated',
		'copied',
		'deleted',
		'reordered',
		'moved_column',
		'moved_to_board',
	];

	const createdByActionsToMap = [
		'added',
		'updated',
		'copied',
		'deleted',
		'reordered',
		'moved_column',
		'moved_to_board',
	];

	const columnIdActionsToMap = [
		'added',
		'updated',
		'copied',
		'deleted',
		'reordered',
		'moved_column',
		'moved_to_board',
	];

	switch (action) {
		case 'added':
			req.body.action = 'Nouvelle card';
			break;
		case 'updated':
			req.body.action = 'Card mise à jour';
			break;
		case 'copied':
			req.body.action = 'Copie de la card';
			break;

		case 'archived':
			req.body.action = 'Card archivé';
			break;
		case 'unarchived':
			req.body.action = 'Card sortie des archives';
			break;
		case 'deleted':
			req.body.action = 'Card supprimé';
			break;
		case 'moved_column':
			req.body.action = 'Card déplacer de colonne';
			break;
		case 'moved_to_board':
			req.body.action = 'Card a été déplacée vers un nouveau board';
			break;
		case 'labels_updated':
			req.body.action = 'Modification des labels';
			break;
		case 'assignees_updated':
			req.body.action = 'Modification des participants';
			break;

		default:
			break;
	}

	const actionToSend = [
		'added',
		'updated',
		'copied',
		'archived',
		'unarchived',
		'deleted',
		'moved_column',
		'moved_to_board',
		'labels_updated',
		'assignees_updated',
	];

	if (assigneesActionsToMap.includes(action)) {
		req.body.card.assignees = await Promise.all(
			req.body.card.assignees.map(async (assignee) => await getUserById(req.body.board.id, assignee.id))
		);
	}

	if (createdByActionsToMap.includes(action)) {
		req.body.card.created_by = await getUserById(req.body.board.id, req.body.card.created_by.id);
	}

	if (columnIdActionsToMap.includes(action)) {
		req.body.card.column = await getColumnById(req.body.board.id, req.body.card.column_id);
	}

	if (actionToSend.includes(action)) {
		templateToMessageValue(req.body).then((data) => console.log(data));
	}

	res.sendStatus(204);
};

// https://support.gitkraken.com/developers/webhooks/event-types-payload/#card

const templateToMessageValue = (body) => {
	const templateValues = {
		action: body.action,
		sender: body.sender.username,
		cardName: body.card.name,
		cardDesc: body.card.description && body.card.description.text,
		cardCreated: body.card.created_date,
		cardCreatedBy: body.card.created_by,
		boardName: body.board.name,
		columnName: body.card.column,
		assignees: body.assignees || body.card.assignees,
		labels: body.card.labels,
		completedTasks: body.card.completed_task_count,
		totalTask: body.card.total_task_count,
		labels: body.labels || body.card.labels,
	};

	return DiscordService.sendMessage(templateValues);
};
