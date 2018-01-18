const log = require('../log');
const bunyanMiddleware = require('bunyan-middleware');

module.exports = bunyanMiddleware({
  logger: log,
  verbose: process.env.NODE_ENV === 'development'
});
