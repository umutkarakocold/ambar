const datastore = require('./datastore');
const userAgentParser = require('./providers/user-agent');
const locationFinder = require('./providers/location');

module.exports = class Event {
  constructor(name, props, meta) {
    this.name = name;
    this.meta = meta;
    this.props = {
      ...props,
      _time_created: meta.time_created,
      _time_received: meta.time_received,
      _app: meta.app,
      _user_id: meta.user_id,
      _device_id: meta.device_id,
      _session_id: meta.session_id
    };

    this.applyFilters();
  }

  save() {
    return datastore.save({
      key: datastore.key(this.name),
      data: this.props
    });
  }

  static save() {
    return new this(...arguments).save();
  }

  applyFilters() {
    this.extractTechnology();
    this.extractLocation();
    this.convertTime();
  }

  extractTechnology() {
    const { ua } = this.meta;

    if (ua) {
      this.props._technology = { ...userAgentParser(ua), ua };
    }
  }

  extractLocation() {
    const { ip } = this.meta;

    if (ip) {
      this.props._location = locationFinder(ip);
    }
  }

  convertTime() {
    Object.keys(this.props).forEach(key => {
      if (key.startsWith('time_')) {
        this.props[key] = new Date(Number(this.props[key]));
      }
    });
  }
};
