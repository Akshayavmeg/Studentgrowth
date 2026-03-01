// =============================================
//   STUGROWTH — script.js
//   Handles navigation and basic form checks
//   for index.html and pages/signup.html
// =============================================

// This runs as soon as the page finishes loading
window.onload = function () {

  console.log("Stugrowth loaded successfully!");
  console.log("Welcome to Stugrowth – Your personalised path to success.");

  // Check which page is currently open
  const currentPage = window.location.pathname;
  console.log("Current page: " + currentPage);


  // =============================================
  // SIGN IN BUTTON — index.html
  // After validation, redirect to dashboard
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

      // Log for debugging
      console.log("Sign In clicked. Username: " + username);

      // TODO: Add real login check here (e.g. check with backend)
      // For now, redirect directly to the dashboard
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
  // SIGN UP BUTTON — pages/signup.html
  // After validation, redirect to dashboard
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

      // Log for debugging
      console.log("Sign Up clicked. Name: " + fullname + " | Email: " + email);

      // TODO: Add real signup logic here (e.g. send data to backend)
      // signup.html is inside pages/ folder, so dashboard.html is in the same folder
      window.location.href = "dashboard.html";

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

};