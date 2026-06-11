document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = 'https://acdrm-backend.onrender.com/api/v1';

  const loginForm = document.getElementById("login-form");
  const errBanner = document.getElementById("error-message");
  const errText = document.getElementById("err-text");
  const submitBtn = document.getElementById("submit-btn");
  
  // Interactive Obfuscation Node Registries
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("toggle-password");

  // 1. Password Visibility Toggle Controller Strategy
  togglePasswordBtn.addEventListener("click", () => {
    const clearTextMode = passwordInput.type === "password";
    passwordInput.type = clearTextMode ? "text" : "password";
    
    // Smooth transition class swaps using classList utility boundary states
    togglePasswordBtn.classList.toggle("bi-eye-slash", !clearTextMode);
    togglePasswordBtn.classList.toggle("bi-eye", clearTextMode);
  });

  // 2. Authentication Transmission Hook Handler
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    errBanner.style.display = "none";
    errBanner.style.animation = 'none';
    void errBanner.offsetWidth; // Force Layout Engine Engine Reflow to cleanly re-trigger CSS animations

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="bi bi-arrow-repeat spin" style="display:inline-block; animation: spin 1s linear infinite;"></i> Authenticating Operator...`;

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid administrative credentials.");
      }

      if (data.token) {
        localStorage.setItem("acdrm_admin_token", data.token);
        window.location.href = "dashboard.html";
      } else {
        throw new Error("Token allocation block missing from gatekeeper response data.");
      }

    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Verify Identity</span>`;
      
      errText.textContent = error.message;
      errBanner.style.display = "flex";
      errBanner.style.animation = 'shake 0.4s ease-in-out';
    }
  });
});

const style = document.createElement('style');
style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);