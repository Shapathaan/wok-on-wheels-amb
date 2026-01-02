// admin.js - COMPLETE FIRESTORE REALTIME
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCxuUV976DmtKyjBn0xqoZAodCw8mQH_mE",
  authDomain: "wok-on-wheels.firebaseapp.com",
  projectId: "wok-on-wheels",
  storageBucket: "wok-on-wheels.firebasestorage.app",
  messagingSenderId: "156058192520",
  appId: "1:156058192520:web:83507356a4c9a8564c2d3d",
  measurementId: "G-JPT8JN4EE4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ordersList = document.getElementById("ordersList");

onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snapshot) => {
  ordersList.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <div style="background:#2a2a3a;padding:1rem;margin-bottom:1rem;border-radius:12px;">
        <h3>${data.customerName || "Guest"} - ${data.customerPhone}</h3>
        <p>Items: ${data.items?.map(i => i.name).join(', ')}</p>
        <p>Total: ₹${data.total} | Notes: ${data.notes}</p>
        <p style="color:#ffc928;font-size:0.9rem;">Status: ${data.status}</p>
      </div>
    `;
    ordersList.appendChild(div);
  });
});
