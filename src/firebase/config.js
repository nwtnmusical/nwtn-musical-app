import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiEQsW2ClPd6dbpmy0EQCNr6JArQnSDYc",
  authDomain: "nwtnmusical-5af09.firebaseapp.com",
  projectId: "nwtnmusical-5af09",
  storageBucket: "nwtnmusical-5af09.firebasestorage.app",
  messagingSenderId: "828049148732",
  appId: "1:828049148732:web:10a4122df30d8422506c39",
  measurementId: "G-K78TCR2ENH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth, analytics };
