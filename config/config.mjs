import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;

export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export const DISCORD_WEBHOOK_ID = process.env.DISCORD_WEBHOOK_ID;
export const DISCORD_WEBHOOK_TOKEN = process.env.DISCORD_WEBHOOK_TOKEN;

export const gloHeader = {
	Authorization: `Bearer ${process.env.GLO_TOKEN}`,
	'Content-type': 'application/json',
};

export const boardsIdList = [
	'60b1538d4119dd00121252e0',
	'60b153984119dd00121252eb',
	'60b153d64119dd0012125302',
	'60b155adface84001313b9cb',
	'60b156d2face84001313ba15',
];
