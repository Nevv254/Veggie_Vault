import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC53AuZme76OvnT4DvMfCXylTs-JZtJpZg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "veggie-vault-a1ad8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "veggie-vault-a1ad8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "veggie-vault-a1ad8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1088330562418",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1088330562418:web:9476c839888e8697a9bbeb"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
