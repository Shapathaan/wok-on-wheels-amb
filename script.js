<!-- script.js ko ye HTML file me direct dal de <script> tag me -->
<script>
document.addEventListener("DOMContentLoaded", function() {
  const loginModal = document.getElementById("loginModal");
  const loginForm = document.getElementById("loginForm");
  
  // Check if already logged in
  if (localStorage.getItem("wow_user")) {
    loginModal.style.display = "none";
  }
  
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    
    if (name && phone.length >= 10) {
      localStorage.setItem("wow_user", JSON.stringify({name, phone}));
      loginModal.style.display = "none";
      alert("Welcome " + name + "!");
    } else {
      alert("Name aur valid phone daalo!");
    }
  });
  
  // Cart basic
  let cart = [];
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  
  // Add to cart buttons
  document.querySelectorAll(".add-combo, .menu-column li").forEach(item => {
    item.addEventListener("click", function() {
      const name = this.dataset.name || this.textContent.trim();
      const price = Number(this.dataset.price || 100);
      cart.push({name, price});
      
      // Update cart display
      cartCount.textContent = cart.length;
      const total = cart.reduce((sum, i) => sum + i.price, 0);
      cartTotal.textContent = total;
      
      // Visual feedback
      this.style.background = "#ffc92820";
      setTimeout(() => this.style.background = "", 300);
    });
  });
  
  console.log("Wok on Wheels ready! 🚀");
});
</script>
