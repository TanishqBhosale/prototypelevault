// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxt5h0FrTbWtLz0QbzPBkFBq83OyI5FmM",
  authDomain: "levault-42397.firebaseapp.com",
  projectId: "levault-42397",
  storageBucket: "levault-42397.firebasestorage.app",
  messagingSenderId: "195373217378",
  appId: "1:195373217378:web:e435f1f601bb107eea833b",
  measurementId: "G-6H4BVT7P68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth();

export default app;