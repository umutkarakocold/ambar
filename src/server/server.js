require('dotenv').config();

const express = require('express');
const server = express();

server.disable('x-powered-by');
server.enable('trust proxy');
server.use(express.static(`${__dirname}/../../public`));
server.use(require('cors')());
server.use(require('body-parser').json());
server.use(require('./middlewares/log'));
server.use(require('./routes'));
server.use((err, req, res, next) => {
  req.log.error(err);
  res.sendStatus(500);
});

const { PORT = 4000 } = process.env;

server.listen(PORT, err => {
  if (err) {
    throw err;
  }

  console.log(`Server started on port ${PORT}`);
});
