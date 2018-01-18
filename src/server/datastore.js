const Datastore = require('@google-cloud/datastore');
const fs = require('fs');
const os = require('os');

const {
  GCLOUD_SERVICE_KEY,
  GOOGLE_APPLICATION_CREDENTIALS = `${os.tmpdir()}/ambar-service-account.json`
} = process.env;

fs.writeFileSync(
  GOOGLE_APPLICATION_CREDENTIALS,
  new Buffer(GCLOUD_SERVICE_KEY, 'base64').toString('ascii')
);

module.exports = new Datastore({
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS
});
