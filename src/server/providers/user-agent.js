const UAParser = require('ua-parser-js');

module.exports = userAgent => {
  const info = new UAParser(userAgent);

  return {
    device: info.getDevice(),
    browser: info.getBrowser(),
    os: info.getOS()
  };
};
