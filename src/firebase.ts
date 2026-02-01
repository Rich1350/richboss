import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA2JENp2tk3-4F6ivlDwbclljGtbO65RcI",
  authDomain: "book-df57d.firebaseapp.com",
  projectId: "book-df57d",
  storageBucket: "book-df57d.firebasestorage.app",
  messagingSenderId: "461280965233",
  appId: "1:461280965233:web:1d745b102228445c94a1d0",
  measurementId: "G-9B55LSFNY9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, analytics };
import { getFirestore } from 'firebase/firestore';
export const db = getFirestore(app);