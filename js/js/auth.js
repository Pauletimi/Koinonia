// js/auth.js

import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// --- SIGN UP LOGIC ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Now, create a document for the user in Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: fullName,
                email: email,
                status: "active", // Default status
                createdAt: new Date()
            });

            alert('Account created successfully!');
            window.location.href = 'dashboard/index.html'; // Redirect to dashboard

        } catch (error) {
            console.error("Error signing up:", error);
            alert(error.message);
        }
    });
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // On successful login, redirect to the dashboard
            window.location.href = 'dashboard/index.html';

        } catch (error) {
            console.error("Error logging in:", error);
            alert(error.message);
        }
    });
}
