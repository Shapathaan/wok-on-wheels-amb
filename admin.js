import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// SAME firebaseConfig as script.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ordersList = document.getElementById("ordersList");
const ding = document.getElementById("ding");

let firstLoad = true;

const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  if (!firstLoad && snapshot.docChanges().some((c) => c.type === "added")) {
    ding.play();
  }
  firstLoad = false;

  ordersList.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "combo-card"; // reuse style
    const items = (data.items || [])
      .map((i) => `${i.name} - ₹${i.price}`)
      .join("<br/>");
    div.innerHTML = `
      <h3>${data.customerName || "Guest"} - ${data.customerPhone || ""}</h3>
      <p><strong>Items:</strong><br/>${items}</p>
      <p><strong>Notes:</strong> ${data.notes || "-"}</p>
      <p style="color:#ffc928;font-size:0.8rem;">Status: ${data.status || "pending"}</p>
    `;
    ordersList.appendChild(div);
  });
});
