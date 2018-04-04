const maxmind = require('maxmind');

const lookup = maxmind.openSync(
  `${__dirname}/../../../data/GeoLite2-City.mmdb`
);

module.exports = ip => {
  const { country, subdivisions } = lookup.get(ip);
  const data = {};

  if (country) {
    data.country = {
      name: country.names.en,
      code: country.iso_code
    };
  }

  if (subdivisions && subdivisions.length) {
    data.city = {
      name: subdivisions[0].names.en,
      code: subdivisions[0].iso_code
    };
  }

  return data;
};
