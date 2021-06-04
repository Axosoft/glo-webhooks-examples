import express from 'express';
import { BoardService } from './api/board.mjs';
import { PORT } from './config/config.mjs';

import { verifyWebhookSignature } from './utils/signature.mjs';
import { postWebHook } from './webhook/webhook.mjs';

export const app = express();

app.use(
	express.json({
		// verify normally allows us to conditionally abort the parse, but we're using
		// to gain easy access to 'buf', which is a Buffer of the raw request body,
		// which we will need later when we validate the webhook signature
		verify: (req, res, buf) => {
			req.buf = buf;
		},
	})
);

app.use(verifyWebhookSignature);
app.post('*', postWebHook);

app.listen(PORT, () => {
	console.log(`Listening for Glo webhooks on port ${PORT}`);
});

//BoardService.getAll().then((data) => console.log(data));
