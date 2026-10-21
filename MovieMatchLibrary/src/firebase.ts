// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjS0qvvGRy5-FQ-WM4AALNEYMzbEQ_gWM",
  authDomain: "authentification-ca251.firebaseapp.com",
  projectId: "authentification-ca251",
  storageBucket: "authentification-ca251.firebasestorage.app",
  messagingSenderId: "45387375473",
  appId: "1:45387375473:web:badfb5a39d6827e82c8cd0",
  measurementId: "G-WRH3N3ZX9N"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);