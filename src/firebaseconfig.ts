// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBl6zt73_HzSw4ng6dJDitXvudH16bQBZM",
  authDomain: "portfoliozz-website.firebaseapp.com",
  projectId: "portfoliozz-website",
  storageBucket: "portfoliozz-website.firebasestorage.app",
  messagingSenderId: "972355157609",
  appId: "1:972355157609:web:f7fae50c43cb01b7726cf8",
  measurementId: "G-LJ5N63BND4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);