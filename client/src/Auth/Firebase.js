import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3But2TlYYKa8aQkK6XW8oG8rUZlTbNxg",
  authDomain: "levaulte.firebaseapp.com",
  projectId: "levaulte",
  storageBucket: "levaulte.firebasestorage.app",
  messagingSenderId: "1031061914899",
  appId: "1:1031061914899:web:b9aa3699505c0b2baa06e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Authentication