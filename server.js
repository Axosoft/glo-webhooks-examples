const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const PORT = 8080;
const WEBHOOK_SECRET = 'YOUR_WEBHOOK_SECRET_HERE';

const createSignature = (buf) => {
  const hmac = crypto.createHmac('sha1', WEBHOOK_SECRET);
  hmac.update(buf, 'utf-8');
  return 'sha1=' + hmac.digest('hex');
};

const app = express();

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    // Save the buffer since we'll need it when validating the webhook signature
    req.buf = buf;
  }
}));

app.post('/', (req, res) => {
  console.log('Received Glo webhook payload', new Date());

  const signature = createSignature(req.buf);
  if (signature !== req.headers['x-gk-signature']) {
    console.log('Invalid signature');
    return res.sendStatus(403);
  }

  console.log('Event', req.headers['x-gk-event']);
  console.log(req.body);

  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Listening for Glo webhooks on port ${PORT}`);
});
