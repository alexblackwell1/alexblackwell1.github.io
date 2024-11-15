// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzZSLb-OfiO3_pr2OnIBHqfzT4pDPB6c8",
  authDomain: "abhome-be49a.firebaseapp.com",
  projectId: "abhome-be49a",
  storageBucket: "abhome-be49a.firebasestorage.app",
  messagingSenderId: "792119340441",
  appId: "1:792119340441:web:48d96894822b3f8fe63708",
  measurementId: "G-1BZ7L8YEN6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
