// https://leovoel.github.io/embed-visualizer/
//
import fetch from 'node-fetch';
import { DISCORD_WEBHOOK_TOKEN, DISCORD_WEBHOOK_ID } from '../config/config.mjs';

import { POST_DISCORD } from '../utils/url.mjs';

const baseUrl = `https://discord.com/api/webhooks/${DISCORD_WEBHOOK_ID}/${DISCORD_WEBHOOK_TOKEN}`;

const message = (values) => {
	const fields = [];
	if (values.assignees !== undefined) {
		console.log('assignees is array', Array.isArray(values.assignees));
		if (Array.isArray(values.assignees)) {
			const value = values.assignees.join(' \r\n') || 'none';
			fields.push({
				name: 'Assignees',
				value,
			});
		} else {
			const { added, removed } = values.assignees;
			const addedAssignee = added.map((a) => `+${a.username}`);
			const removedAssignee = removed.map((a) => `-~~${a.username}~~`);

			console.log('addedAssignee', addedAssignee);
			console.log('removedAssignee', removedAssignee);
			const value = [...addedAssignee, ...removedAssignee].join(' \r\n');
			fields.push({
				name: 'Assignees',
				value,
			});
		}
	}

	if (values.totalTask !== undefined && values.totalTask !== 0) {
		const value = `${values.completedTasks} / ${values.totalTask}`;
		fields.push({
			name: 'Task',
			value,
		});
	}

	if (values.labels !== undefined) {
		if (Array.isArray(values.labels)) {
			const value = values.labels.map((a) => a.name).join(' \r\n') || 'none';
			fields.push({
				name: 'Labels',
				value,
			});
		} else {
			const { added, removed } = values.labels;
			const value = [...added.map((a) => `+${a.name}`), ...removed.map((a) => `-~~${a.name}~~`)].join(' \r\n');
			fields.push({
				name: 'Labels',
				value,
			});
		}
	}

	const result = {
		content: `${values.action} fait par ${values.sender}`,
		embeds: [
			{
				title: values.cardName,
				color: 9442302,
				description: values.cardDesc,
				timestamp: values.cardCreated,
				footer: {
					text: (values.cardCreatedBy && `Par ${values.cardCreatedBy}`) || '',
				},
				author: {
					name: `${values.boardName} > ${values.columnName || ''}`,
				},
				fields,
			},
		],
	};
	console.log(JSON.stringify(result));
	return result;
};

export const DiscordService = {
	sendMessage: (values) =>
		fetch(baseUrl, POST_DISCORD(message(values))).then(
			(response) => (response.status != 204 && response.json()) || 'No Content'
		),
};
