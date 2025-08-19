// js/dashboard.js

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const welcomeMessage = document.querySelector('.dashboard-content h2');
const userStatusEl = document.getElementById('user-status');
const historyTableBody = document.getElementById('history-table-body');
const provideHelpForm = document.getElementById('provide-help-form');

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in.
        const uid = user.uid;
        
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${userData.fullName}!`;
            }
            if (userStatusEl) {
                userStatusEl.textContent = `Status: ${userData.status}`;
            }
        } else {
            console.log("No such user document!");
        }

        // If on history page, load history
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
                createdAt: new Date(),
                receiverId: null // Not matched yet
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

// --- LOAD HISTORY LOGIC ---
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
                <td>${transaction.status.replace('_', ' ')}</td>
            </tr>
        `;
    });
    
    historyTableBody.innerHTML = html || '<tr><td colspan="4">No transactions found.</td></tr>';
}


// --- LOGOUT LOGIC ---
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
