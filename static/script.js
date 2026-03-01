// =============================================
//   STUGROWTH — script.js
//   Handles navigation and form checks.
//
//   FLOW:
//   1. Signup  → saves Full Name → goes to login
//   2. Login   → reads Full Name → goes to dashboard
//   3. Dashboard → displays Full Name in header
//   4. Logout  → clears Full Name → goes to login
// =============================================

// This runs as soon as the page finishes loading
window.onload = function () {

  console.log("Stugrowth loaded successfully!");
  console.log("Welcome to Stugrowth – Your personalised path to success.");

  // Check which page is currently open
  const currentPage = window.location.pathname;
  console.log("Current page: " + currentPage);


  // =============================================
  // SIGN UP BUTTON — pages/signup.html
  // Validates form, saves Full Name to localStorage,
  // then redirects to login page (../index.html)
  // =============================================
  const signupBtn = document.getElementById("signupBtn");

  if (signupBtn) {
    signupBtn.addEventListener("click", function () {

      const fullname        = document.getElementById("fullname").value.trim();
      const email           = document.getElementById("email").value.trim();
      const username        = document.getElementById("username").value.trim();
      const password        = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirm-password").value.trim();

      // Check all fields are filled
      if (fullname === "" || email === "" || username === "" || password === "" || confirmPassword === "") {
        alert("Please fill in all the fields before signing up.");
        return;
      }

      // Check both passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      // Save Full Name in localStorage so the dashboard can display it
      localStorage.setItem("stuFullName", fullname);

      console.log("Sign Up successful. Full Name saved: " + fullname);

      // Redirect to login page so the user can sign in
      // signup.html is inside pages/ so index.html is one level up
      window.location.href = "../index.html";

    });
  }


  // =============================================
  // SIGN IN BUTTON — index.html
  // Validates login fields, retrieves stored Full Name,
  // then redirects to pages/dashboard.html
  // =============================================
  const signinBtn = document.getElementById("signinBtn");

  if (signinBtn) {
    signinBtn.addEventListener("click", function () {

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Make sure both fields are filled in
      if (username === "" || password === "") {
        alert("Please enter both your username and password.");
        return;
      }

      console.log("Sign In clicked. Username: " + username);

      // If a Full Name was saved during signup, keep it.
      // If not (e.g. direct login), save the username as the display name.
      if (!localStorage.getItem("stuFullName")) {
        localStorage.setItem("stuFullName", username);
      }

      // TODO: Add real login check here (e.g. check with backend)
      // Redirect to the dashboard
      window.location.href = "pages/dashboard.html";

    });
  }


  // =============================================
  // CREATE ACCOUNT LINK — index.html
  // Redirects user to the signup page
  // =============================================
  const createAccountLink = document.getElementById("createAccountLink");

  if (createAccountLink) {
    createAccountLink.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Redirecting to signup page...");
      window.location.href = "pages/signup.html";
    });
  }


  // =============================================
  // GET STARTED BUTTON — future landing page
  // Redirects to signup
  // =============================================
  const getStartedBtn = document.getElementById("getStartedBtn");

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", function () {
      console.log("Get Started button clicked");
      window.location.href = "pages/signup.html";
    });
  }


  // =============================================
  // LOGOUT BUTTON — pages/dashboard.html
  // Clears stored Full Name and redirects to login
  // =============================================
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      console.log("User logged out. Clearing stored name...");
      // Remove the stored Full Name on logout
      localStorage.removeItem("stuFullName");
      window.location.href = "../index.html";
    });
  }


  // =============================================
  // DASHBOARD NAME DISPLAY — pages/dashboard.html
  // Reads Full Name from localStorage and updates
  // the topbar greeting and welcome banner heading
  // =============================================
  const topbarGreeting    = document.getElementById("topbarGreeting");
  const welcomeBannerName = document.getElementById("welcomeBannerName");

  // Only run if we are on the dashboard page
  if (topbarGreeting || welcomeBannerName) {

    // Get the saved Full Name (default to "Student" if nothing is saved)
    const fullName = localStorage.getItem("stuFullName") || "Student";

    console.log("Dashboard loaded. Displaying name: " + fullName);

    // Update the small greeting in the top navbar
    if (topbarGreeting) {
      topbarGreeting.textContent = "Hello, " + fullName + " 👋";
    }

    // Update the welcome banner heading
    if (welcomeBannerName) {
      welcomeBannerName.textContent = "Welcome back, " + fullName + "! 🎓";
    }

  }

};