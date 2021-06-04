import crypto from 'crypto';
import { WEBHOOK_SECRET } from '../config/config.mjs';

const createSignature = (buf) => {
	const hmac = crypto.createHmac('sha1', WEBHOOK_SECRET);
	hmac.update(buf, 'utf-8');
	return 'sha1=' + hmac.digest('hex');
};

export const verifyWebhookSignature = (req, res, next) => {
	const signature = createSignature(req.buf);
	if (signature !== req.headers['x-gk-signature']) {
		return res.status(403).send('invalid signature');
	}

	next();
};
