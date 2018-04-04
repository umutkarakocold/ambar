import './polyfill';

const { API_URL = 'https://ambar.garajsepeti.com' } = process.env;

let APP_ID, DEVICE_ID, SESSION_ID, USER_ID;

export default {
  init({ appId, userId = '' }) {
    APP_ID = appId;
    DEVICE_ID = storageItem('device_id', generateId());
    SESSION_ID = storageItem('session_id', generateId(), sessionStorage);
    this.setUserId(userId);
  },

  setUserId(userId) {
    USER_ID = userId;
  },

  logEvent(name, props) {
    if (!APP_ID) {
      throw new Error('First set appId by calling init() function');
    }

    navigator.sendBeacon(
      API_URL + '/beacon',
      JSON.stringify({
        name,
        props,
        meta: {
          'app-id': APP_ID,
          'user-id': USER_ID,
          'device-id': DEVICE_ID,
          'session-id': SESSION_ID,
          timestamp: Date.now()
        }
      })
    );
  }
};

function generateId() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function storageItem(key, defaultValue, storage = localStorage) {
  let val = storage.getItem(`ambar_${key}`);

  if (!val && defaultValue) {
    storage.setItem(`ambar_${key}`, defaultValue);

    return defaultValue;
  }

  return val || defaultValue;
}
