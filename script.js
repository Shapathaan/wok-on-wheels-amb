// script.js - COMPLETE VERSION WITH YOUR FIREBASE CONFIG
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// YOUR FIREBASE CONFIG - ALREADY PASTED
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
  if (!name || phone.length < 10) return alert("Complete all fields.");
  localStorage.setItem("wow_user", JSON.stringify({ name, phone }));
  loginModal.style.display = "none";
  checkLogin();
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

// Load cart from localStorage
function loadCart() {
  const saved = localStorage.getItem("wow_cart");
  if (saved) cart = JSON.parse(saved);
  updateCartUI();
}
loadCart();

// Menu item click
document.querySelectorAll(".menu-column li").forEach((item) => {
  item.addEventListener("click", () => {
    const name = item.dataset.name;
    const price = Number(item.dataset.price || 0);
    addToCart(name, price);
    item.style.color = "#ffc928";
    setTimeout(() => (item.style.color = ""), 500);
  });
});

// Combo buttons
document.querySelectorAll(".add-combo").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price || 0);
    addToCart(name, price);
    btn.textContent = "Added!";
    setTimeout(() => (btn.textContent = "Add to Order"), 1000);
  });
});

function addToCart(name, price) {
  cart.push({ name, price, qty: 1 });
  updateCartUI();
  localStorage.setItem("wow_cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotal.textContent = total.toLocaleString();
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (!cart.length) return alert("Cart is empty.");
  orderSection.classList.remove("hidden");
  window.scrollTo({ top: orderSection.offsetTop - 100, behavior: "smooth" });
});

// ---------- FIRESTORE ORDER + WHATSAPP ----------
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("wow_user") || "{}");

  const orderData = {
    customerName: user.name || "Guest",
    customerPhone: user.phone || "",
    items: cart,
    notes: orderNotes.value.trim() || "No notes",
    subtotal: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    createdAt: serverTimestamp(),
    status: "pending",
    orderId: "WOW" + Date.now().toString().slice(-6)
  };

  try {
    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("Order saved with ID:", docRef.id);

    // WhatsApp message
    const itemsText = cart
      .map((i) => `• ${i.name} x${i.qty} - ₹${i.price * i.qty}`)
      .join("
");
    const encoded = encodeURIComponent(
      `🛵 *New Order* - Wok on Wheels

👤 *Customer:* ${orderData.customerName}
📱 *Phone:* ${orderData.customerPhone}
🆔 *Order ID:* ${orderData.orderId}

📋 *Items:*
${itemsText}

💰 *Total:* ₹${orderData.subtotal}
📝 *Notes:* ${orderData.notes}

⏰ *Time:* ${new Date().toLocaleString("en-IN")}`
    );
    const waUrl = `https://wa.me/91XXXXXXXXXX?text=${encoded}`;
    window.open(waUrl, "_blank");

    // Clear cart
    cart = [];
    localStorage.removeItem("wow_cart");
    updateCartUI();
    orderSection.classList.add("hidden");
    orderNotes.value = "";
    
    alert("✅ Order placed successfully!
💬 WhatsApp opened for confirmation.
📱 Admin panel pe live dikhega.");
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Error placing order. Check console.");
  }
});

// ---------- LOTTIE ANIMATIONS ----------
function loadLottie(id, path) {
  return lottie.loadAnimation({
    container: document.getElementById(id),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: path || "https://assets.lottiefiles.com/packages/lf20_1a9h5z.json"
  });
}

// Default Lottie files (replace with your assets/lottie/*.json)
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

// Clear cart on page unload (optional)
window.addEventListener("beforeunload", () => {
  localStorage.removeItem("wow_cart");
});
