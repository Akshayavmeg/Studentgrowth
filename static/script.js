// =============================================
//   STUGROWTH — script.js
//   Basic JavaScript for the Stugrowth project
// =============================================

// This runs as soon as the page finishes loading
window.onload = function () {

  console.log("Stugrowth loaded successfully!");
  console.log("Welcome to Stugrowth – Your personalised path to success.");

  // Check which page is currently open
  const currentPage = window.location.pathname;
  console.log("Current page: " + currentPage);

  // ---- Sign In Button (index.html) ----
  const signinBtn = document.getElementById("signinBtn");

  if (signinBtn) {
    signinBtn.addEventListener("click", function () {

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Basic validation — make sure fields are not empty
      if (username === "" || password === "") {
        alert("Please enter both your username and password.");
        return;
      }

      // TODO: Add real login logic here later (e.g. send to backend)
      console.log("Sign In button clicked");
      console.log("Username entered: " + username);
      alert("Sign In clicked! Backend not connected yet.");

    });
  }

  // ---- Sign Up Button (signup.html) ----
  const signupBtn = document.getElementById("signupBtn");

  if (signupBtn) {
    signupBtn.addEventListener("click", function () {

      const fullname        = document.getElementById("fullname").value.trim();
      const email           = document.getElementById("email").value.trim();
      const username        = document.getElementById("username").value.trim();
      const password        = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirm-password").value.trim();

      // Basic validation — check all fields are filled
      if (fullname === "" || email === "" || username === "" || password === "" || confirmPassword === "") {
        alert("Please fill in all the fields before signing up.");
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      // TODO: Add real signup logic here later (e.g. send to backend)
      console.log("Sign Up button clicked");
      console.log("Name: " + fullname + " | Email: " + email + " | Username: " + username);
      alert("Account created! Backend not connected yet.");

    });
  }

  // ---- Create Account Link (index.html) ----
  const createAccountLink = document.getElementById("createAccountLink");

  if (createAccountLink) {
    createAccountLink.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Redirecting to signup page...");
      window.location.href = "signup.html";
    });
  }

  // ---- Get Started Button (for future dashboard/landing page) ----
  const getStartedBtn = document.getElementById("getStartedBtn");

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", function () {
      console.log("Get Started button clicked");
      // TODO: Redirect to signup or dashboard later
      window.location.href = "signup.html";
    });
  }

};