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

    fetch(API_URL + '/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ambar-App-ID': APP_ID,
        'X-Ambar-User-ID': USER_ID,
        'X-Ambar-Device-ID': DEVICE_ID,
        'X-Ambar-Session-ID': SESSION_ID,
        'X-Ambar-Timestamp': Date.now()
      },
      body: JSON.stringify({ name, props })
    }).catch(err => {
      console.error('Failed to submit data', err);
    });
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
