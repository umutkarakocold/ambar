const { Router } = require('express');
const bodyParser = require('body-parser');
const Event = require('./event');
const auth = require('./middlewares/auth');
const router = Router();

router.post('/beacon', bodyParser.text(), (req, res) => {
  const body = JSON.parse(req.body);

  Object.keys(body.meta).map(k => {
    req.headers[`x-ambar-${k.toLowerCase()}`] = body.meta[k];
  });

  req.headers['content-type'] = 'application/json';
  req.url = '/events';
  req.body = body;

  router.handle(req, res);
});

router.post('/events', auth, bodyParser.json(), async (req, res) => {
  const {
    headers: {
      'x-ambar-ip': ip = req.ip,
      'x-ambar-user-id': user_id,
      'x-ambar-device-id': device_id,
      'x-ambar-session-id': session_id,
      'x-ambar-timestamp': time,
      'user-agent': ua
    },
    body: { name, props }
  } = req;

  if (!name) {
    throw new Error('Event name is required');
  }

  if (!time) {
    throw new Error('Missing X-Ambar-Time header');
  }

  try {
    await Event.save(name, props, {
      app: req.user.code,
      ua,
      ip,
      user_id,
      device_id,
      session_id,
      time_created: new Date(Number(time)),
      time_received: new Date()
    });

    res.sendStatus(201);
  } catch (err) {
    req.log.error(err);
    throw err;
  }
});

module.exports = router;
