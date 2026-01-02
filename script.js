// script.js - FIXED LOGIN + COMPLETE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
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

// ---------- ALL CODE INSIDE DOM READY ----------
document.addEventListener("DOMContentLoaded", () => {
  
  // LOGIN
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
    if (!name || phone.length < 10) {
      alert("Name aur 10 digit phone daalo!");
      return;
    }
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

  // Load saved cart
  function loadCart() {
    const saved = localStorage.getItem("wow_cart");
    if (saved) cart = JSON.parse(saved);
    updateCartUI();
  }
  loadCart();

  function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    localStorage.setItem("wow_cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    cartCount.textContent = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = total.toLocaleString();
  }

  // Menu clicks
  document.querySelectorAll(".menu-column li").forEach((item) => {
    item.addEventListener("click", () => {
      const name = item.dataset.name;
      const price = Number(item.dataset.price || 0);
      addToCart(name, price);
      item.style.color = "#ffc928";
      setTimeout(() => (item.style.color = ""), 300);
    });
  });

  document.querySelectorAll(".add-combo").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price || 0);
      addToCart(name, price);
      btn.textContent = "Added ✓";
      setTimeout(() => (btn.textContent = "Add to Order"), 1000);
    });
  });

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    if (!cart.length) return alert("Cart khali hai!");
    orderSection.classList.remove("hidden");
    window.scrollTo({ top: orderSection.offsetTop - 100, behavior: "smooth" });
  });

  // ---------- ORDER SUBMIT ----------
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("wow_user") || "{}");

    const orderData = {
      customerName: user.name || "Guest",
      customerPhone: user.phone || "",
      items: cart,
      notes: orderNotes.value || "No notes",
      total: cart.reduce((sum, i) => sum + i.price, 0),
      createdAt: serverTimestamp(),
      status: "pending"
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      
      // WhatsApp
      const message = `🛵 *Wok on Wheels Order*

👤 ${orderData.customerName}
📱 ${orderData.customerPhone}

${cart.map(i => `• ${i.name} - ₹${i.price}`).join('
')}

💰 Total: ₹${orderData.total}
📝 ${orderData.notes}`;
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/91XXXXXXXXXX?text=${encoded}`, '_blank');
      
      // Clear
      cart = [];
      localStorage.removeItem("wow_cart");
      updateCartUI();
      orderSection.classList.add("hidden");
      orderNotes.value = "";
      
      alert("✅ Order successful! WhatsApp khul gaya.");
    } catch (err) {
      console.error(err);
      alert("❌ Error! Console dekho.");
    }
  });

  // ---------- LOTTIE ----------
  if (document.getElementById('upiLottie')) {
    lottie.loadAnimation({
      container: document.getElementById('upiLottie'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://assets.lottiefiles.com/packages/lf20_1a9h5z.json'
    });
  }

  document.querySelectorAll('.social-lottie').forEach(el => {
    el.addEventListener('click', () => {
      const url = el.dataset.url;
      if (url) window.open(url, '_blank');
    });
  });
});
