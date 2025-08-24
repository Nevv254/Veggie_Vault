import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC53AuZme76OvnT4DvMfCXylTs-JZtJpZg",
  authDomain: "veggie-vault-a1ad8.firebaseapp.com",
  projectId: "veggie-vault-a1ad8",
  storageBucket: "veggie-vault-a1ad8.firebasestorage.app",
  messagingSenderId: "1088330562418",
  appId: "1:1088330562418:web:9476c839888e8697a9bbeb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
