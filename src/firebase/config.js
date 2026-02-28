import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBiEQsW2ClPd6dbpmy0EQCNr6JArQnSDYc",
  authDomain: "nwtnmusical-5af09.firebaseapp.com",
  projectId: "nwtnmusical-5af09",
  storageBucket: "nwtnmusical-5af09.firebasestorage.app",
  messagingSenderId: "828049148732",
  appId: "1:828049148732:web:10a4122df30d8422506c39",
  measurementId: "G-K78TCR2ENH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.log('Persistence not supported');
  }
});

export { db, storage, auth, analytics };
