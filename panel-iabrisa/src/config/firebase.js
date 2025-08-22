import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const env = () =>
  window.location.hostname === 'localhost' ? '_PROD' : '_PROD';

const firebaseConfig = {
  databaseURL: process.env[`REACT_APP_DATABASE_URL${env()}`],
  apiKey: process.env[`REACT_APP_API_KEY${env()}`],
  authDomain: process.env[`REACT_APP_AUTH_DOMAIN${env()}`],
  projectId: process.env[`REACT_APP_PROJECT_ID${env()}`],
  storageBucket: process.env[`REACT_APP_STORAGE_BUCKET${env()}`],
  messagingSenderId: process.env[`REACT_APP_MESSAGING_SENDER_ID${env()}`],
  appId: process.env[`REACT_APP_APP_ID${env()}`],
  measurementId: process.env[`REACT_APP_MEASUREMENT_ID${env()}`]
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage, analytics };
