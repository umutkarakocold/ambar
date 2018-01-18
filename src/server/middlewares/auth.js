const datastore = require('../datastore');
const match = require('micromatch');

module.exports = async (req, res, next) => {
  const { 'x-ambar-app-id': appId } = req.headers;

  if (!appId) {
    return res.sendStatus(401);
  }

  const [apps] = await datastore.runQuery(
    datastore
      .createQuery('App')
      .filter('__key__', datastore.key(['App', Number(appId)]))
      .limit(1)
  );

  if (!apps.length) {
    return res.sendStatus(403);
  }

  const [app] = apps;

  if (!match.any(req.hostname, app.domains)) {
    return res.sendStatus(403);
  }

  req.user = app;

  next();
};
