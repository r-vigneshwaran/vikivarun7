import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyCtvwzQSEDfy163S2ZrxMGK-RtH8TBO1p8',
  authDomain: 'clone-54618.firebaseapp.com',
  projectId: 'clone-54618',
  storageBucket: 'clone-54618.appspot.com',
  messagingSenderId: '607965170699',
  appId: '1:607965170699:web:b9d7810f94f1e9787e8b0e',
  measurementId: 'G-GL91G2Y61Y'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
export { auth, db };
export default app;
