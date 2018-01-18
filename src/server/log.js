const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'Ambar',
  level: process.env.LOG_LEVEL || bunyan.INFO,
  serializers: bunyan.stdSerializers
});
