// js/dashboard.js

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// --- DOM Element References ---
const welcomeMessage = document.querySelector('.dashboard-content h2');
const userStatusEl = document.getElementById('user-status');
const historyTableBody = document.getElementById('history-table-body');

// Page-specific form references
const provideHelpForm = document.getElementById('provide-help-form');
const profileForm = document.getElementById('profile-form');
const supportForm = document.getElementById('support-form');

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in.
        const uid = user.uid;
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            // Populate common elements
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${userData.fullName}!`;
            }
            if (userStatusEl) {
                userStatusEl.textContent = `Status: ${userData.status}`;
            }

            // --- NEW: Populate Profile Page ---
            if (profileForm) {
                document.getElementById('fullName').value = userData.fullName;
                document.getElementById('email').value = userData.email;
            }
        } else {
            console.log("No such user document!");
        }

        // Load history if on history page
        if (historyTableBody) {
            loadTransactionHistory(uid);
        }

    } else {
        // User is signed out.
        console.log("User is not signed in. Redirecting to login.");
        window.location.href = '../login.html';
    }
});

// --- PROVIDE HELP LOGIC ---
if (provideHelpForm) {
    provideHelpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        if (!auth.currentUser || !amount) return;

        try {
            await addDoc(collection(db, "transactions"), {
                providerId: auth.currentUser.uid,
                amount: Number(amount),
                status: "pending_match",
                createdAt: serverTimestamp(),
                receiverId: null
            });
            alert('Your pledge has been successfully recorded!');
            provideHelpForm.reset();
            window.location.href = 'history.html';
        } catch (error) {
            console.error("Error adding transaction: ", error);
            alert("Could not record your pledge. Please try again.");
        }
    });
}

// --- NEW: PROFILE UPDATE LOGIC ---
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newFullName = document.getElementById('fullName').value;
        if (!auth.currentUser || !newFullName) return;

        const userDocRef = doc(db, "users", auth.currentUser.uid);

        try {
            await updateDoc(userDocRef, {
                fullName: newFullName
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert("Could not update your profile. Please try again.");
        }
    });
}

// --- NEW: SUPPORT TICKET SUBMISSION LOGIC ---
if (supportForm) {
    supportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        if (!auth.currentUser || !subject || !message) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            await addDoc(collection(db, "supportTickets"), {
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                subject: subject,
                message: message,
                status: 'new',
                createdAt: serverTimestamp()
            });
            alert('Support ticket submitted successfully! Our team will review it shortly.');
            supportForm.reset();
        } catch (error) {
            console.error("Error submitting support ticket: ", error);
            alert("There was an error submitting your ticket. Please try again.");
        }
    });
}


// --- LOAD HISTORY LOGIC (Unchanged) ---
async function loadTransactionHistory(uid) {
    historyTableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
    
    const q = query(collection(db, "transactions"), where("providerId", "==", uid));
    const querySnapshot = await getDocs(q);
    
    let html = '';
    querySnapshot.forEach((doc) => {
        const transaction = doc.data();
        html += `
            <tr>
                <td>${transaction.createdAt.toDate().toLocaleDateString()}</td>
                <td>Provide Help</td>
                <td>$${transaction.amount}</td>
                <td>${transaction.status.replace(/_/g, ' ')}</td>
            </tr>
        `;
    });
    
    historyTableBody.innerHTML = html || '<tr><td colspan="4">No transactions found.</td></tr>';
}


// --- LOGOUT LOGIC (Unchanged) ---
document.querySelectorAll('.logout').forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Logout Error', error);
        }
    });
});
