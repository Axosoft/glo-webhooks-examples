const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const PORT = 8080;
const WEBHOOK_SECRET = '';

const createSignature = (buf) => {
  const hmac = crypto.createHmac('sha1', WEBHOOK_SECRET);
  hmac.update(buf, 'utf-8');
  return 'sha1=' + hmac.digest('hex');
};

const verifyWebhookSignature = (req, res, next) => {
  const signature = createSignature(req.buf);
  if (signature !== req.headers['x-gk-signature']) {
    return res.status(403).send('invalid signature');
  }

  next();
};

const app = express();

app.use(bodyParser.json({
  // verify normally allows us to conditionally abort the parse, but we're using
  // to gain easy access to 'buf', which is a Buffer of the raw request body,
  // which we will need later when we validate the webhook signature
  verify: (req, res, buf) => {
    req.buf = buf;
  }
}));

app.use(verifyWebhookSignature);

app.post('*', (req, res) => {
  console.log('Received Glo webhook payload', new Date());
  console.log('Event', req.headers['x-gk-event']);
  console.log(req.body);

  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Listening for Glo webhooks on port ${PORT}`);
});
