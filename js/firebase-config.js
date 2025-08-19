// js/firebase-config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9ikNYt8QnD6FHm1MOq11HB0kTP_X8qNQ",
    authDomain: "wealth-club-65dab.firebaseapp.com",
    projectId: "wealth-club-65dab",
    storageBucket: "wealth-club-65dab.firebasestorage.app",
    messagingSenderId: "906138407714",
    appId: "1:906138407714:web:78e002acd44d2af326cb7b",
    measurementId: "G-8H8CZ65956"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services so you can import them in other files
export { auth, db };
