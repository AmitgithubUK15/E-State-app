// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-466ac.firebaseapp.com",
  projectId: "mern-estate-466ac",
  storageBucket: "mern-estate-466ac.appspot.com",
  messagingSenderId: "738675562149",
  appId: "1:738675562149:web:9a07c1e37c0282f38edf4c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);