// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: yahan apna Firebase config chipka
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

// ---------- LOGIN ----------
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");

function checkLogin() {
  const user = localStorage.getItem("wow_user");
  if (!user) {
    loginModal.style.display = "flex";
  } else {
    loginModal.style.display = "none";
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  if (!name || phone.length < 10) return;
  localStorage.setItem("wow_user", JSON.stringify({ name, phone }));
  loginModal.style.display = "none";
});

checkLogin();

// ---------- CART ----------
let cart = [];

const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const orderSection = document.getElementById("orderSection");
const orderForm = document.getElementById("orderForm");
const orderNotes = document.getElementById("orderNotes");

// Menu item click
document.querySelectorAll(".menu-column li").forEach((item) => {
  item.addEventListener("click", () => {
    const name = item.dataset.name;
    const price = Number(item.dataset.price || 0);
    addToCart(name, price);
  });
});

// Combo buttons
document.querySelectorAll(".add-combo").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price || 0);
    addToCart(name, price);
  });
});

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartUI();
}

function updateCartUI() {
  cartCount.textContent = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = total;
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (!cart.length) return alert("Cart is empty.");
  orderSection.classList.remove("hidden");
  window.scrollTo({ top: orderSection.offsetTop - 80, behavior: "smooth" });
});

// ---------- FIRESTORE + WHATSAPP ORDER ----------
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("wow_user") || "{}");

  const orderData = {
    customerName: user.name || "",
    customerPhone: user.phone || "",
    items: cart,
    notes: orderNotes.value,
    createdAt: serverTimestamp(),
    status: "pending"
  };

  try {
    await addDoc(collection(db, "orders"), orderData);
    // WhatsApp deeplink
    const encoded = encodeURIComponent(
      `New Order - Wok on Wheels
Name: ${orderData.customerName}
Phone: ${orderData.customerPhone}
Items:
` +
        cart.map((c) => `• ${c.name} - ₹${c.price}`).join("
") +
        `
Total: ₹${cart.reduce((s, i) => s + i.price, 0)}
Notes: ${orderData.notes}`
    );
    const waUrl = `https://wa.me/91XXXXXXXXXX?text=${encoded}`;
    window.open(waUrl, "_blank");
    alert("Order placed! You will also get confirmation on WhatsApp.");
    cart = [];
    updateCartUI();
    orderSection.classList.add("hidden");
    orderNotes.value = "";
  } catch (err) {
    console.error(err);
    alert("Error placing order. Please try again.");
  }
});

// ---------- LOTTIE ----------
function loadLottie(id, path) {
  return lottie.loadAnimation({
    container: document.getElementById(id),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path
  });
}

// Replace these with actual .json paths
loadLottie("upiLottie", "assets/lottie/upi-qr.json");
loadLottie("instaLottie", "assets/lottie/insta.json");
loadLottie("waLottie", "assets/lottie/whatsapp.json");

// Social click handlers
document.querySelectorAll(".social-lottie").forEach((el) => {
  el.addEventListener("click", () => {
    const url = el.dataset.url;
    if (url) window.open(url, "_blank");
  });
});
