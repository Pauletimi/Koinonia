// js/admin.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Check if the user is an admin before loading data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const adminDocRef = doc(db, "admins", user.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (!adminDocSnap.exists()) {
            alert("Access Denied. You are not an administrator.");
            window.location.href = '../index.html';
            return;
        }

        // If user is an admin, proceed to load the relevant data
        loadUsers();
        loadTransactions();

    } else {
        window.location.href = '../login.html';
    }
});


// --- LOAD USERS FOR ADMIN PANEL ---
async function loadUsers() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;

    const querySnapshot = await getDocs(collection(db, "users"));
    let html = '';
    querySnapshot.forEach((doc) => {
        const user = doc.data();
        html += `
            <tr>
                <td>${doc.id}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="status-${user.status}">${user.status}</span></td>
                <td>
                    <button class="action-btn">Suspend</button>
                    <button class="action-btn delete">Delete</button>
                </td>
            </tr>
        `;
    });
    usersTableBody.innerHTML = html;
}

// --- LOAD TRANSACTIONS FOR ADMIN PANEL ---
async function loadTransactions() {
    const transactionsTableBody = document.getElementById('transactions-table-body');
    if (!transactionsTableBody) return;

    const querySnapshot = await getDocs(collection(db, "transactions"));
    let html = '';
    querySnapshot.forEach((doc) => {
        const t = doc.data();
        html += `
            <tr>
                <td>${doc.id}</td>
                <td>${t.providerId}</td>
                <td>${t.receiverId || 'N/A'}</td>
                <td>$${t.amount}</td>
                <td>${t.status}</td>
                <td><button class="action-btn">View Details</button></td>
            </tr>
        `;
    });
    transactionsTableBody.innerHTML = html;
}
