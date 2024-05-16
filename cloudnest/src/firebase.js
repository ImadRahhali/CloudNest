import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCF5DSOkQ8wiOoR2gEr2gNjKJdjC_mquf0",
  authDomain: "cloudnest-1.firebaseapp.com",
  projectId: "cloudnest-1",
  storageBucket: "cloudnest-1.appspot.com",
  messagingSenderId: "331574939803",
  appId: "1:331574939803:web:51d0f1e734bab25426363e",
  measurementId: "G-79FMX4TFB0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);