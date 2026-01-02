<script>
// WOK ON WHEELS - WHATSAPP ONLY (NO FIREBASE)
document.addEventListener("DOMContentLoaded", function() {
  
  // 1. SIMPLE LOGIN
  const loginModal = document.getElementById("loginModal");
  const loginForm = document.getElementById("loginForm");
  
  // Skip login if already done
  if (localStorage.getItem("wow_user")) {
    loginModal.style.display = "none";
  }
  
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    if (name && phone.length >= 10) {
      localStorage.setItem("wow_user", JSON.stringify({name, phone}));
      loginModal.style.display = "none";
    }
    return false;
  };
  
  // 2. CART
  let cart = [];
  
  // Update cart display
  function updateCart() {
    document.getElementById("cartCount").textContent = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("cartTotal").textContent = total;
  }
  
  // Add to cart
  document.querySelectorAll(".add-combo, li[data-name]").forEach(el => {
    el.onclick = function() {
      const name = this.dataset.name || this.innerText.trim();
      const price = parseInt(this.dataset.price) || 100;
      cart.push({name, price});
      updateCart();
      
      // Visual feedback
      this.style.background = "#ffc92830";
      setTimeout(() => this.style.background = "", 500);
    };
  });
  
  // 3. CHECKOUT → WHATSAPP
  document.getElementById("orderForm").onsubmit = function(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("wow_user") || "{}");
    const notes = document.getElementById("orderNotes").value;
    
    // WhatsApp message
    let message = `🛵 *Wok on Wheels Order*

👤 *${user.name || "Guest"}*
📱 ${user.phone}

`;
    message += `📋 *Cart:*
${cart.map(i => `• ${i.name} - ₹${i.price}`).join('
')}

`;
    message += `💰 *Total:* ₹${cart.reduce((s,i)=>s+i.price,0)}
📝 *Notes:* ${notes}`;
    
    // Open WhatsApp
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91YOURNUMBERHERE?text=${encoded}`, '_blank');
    
    // Clear cart
    cart = [];
    updateCart();
    document.getElementById("orderSection").classList.add("hidden");
  };
  
  document.getElementById("checkoutBtn").onclick = function() {
    if (cart.length === 0) {
      alert("Pehle kuch add karo cart me!");
      return;
    }
    document.getElementById("orderSection").classList.remove("hidden");
    document.getElementById("orderSection").scrollIntoView({behavior: "smooth"});
  };
  
  console.log("🚀 Wok on Wheels ready - WhatsApp orders!");
});
</script>
