// js/firebase-config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfk3ZkXWIm_7nv22qu5yjLs9O_INGW0wY",
    authDomain: "wealthclubapp-15c80.firebaseapp.com",
    projectId: "wealthclubapp-15c80",
    storageBucket: "wealthclubapp-15c80.appspot.com",
    messagingSenderId: "450374444529",
    appId: "1:450374444529:web:e4cbe76551f7b7e7891050"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services so you can import them in other files
export { auth, db };
