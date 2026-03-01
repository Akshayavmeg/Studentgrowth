// =============================================
//   STUGROWTH — script.js
//   Handles navigation, validation, and login.
//
//   FLOW:
//   1. Signup    → saves Full Name + Password → goes to login
//   2. Login     → checks credentials → sets isLoggedIn → goes to dashboard
//   3. Dashboard → checks isLoggedIn (redirect if missing) → displays Full Name
//   4. Logout    → clears all stored data → goes to login
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
  // Saves Full Name and Password to localStorage,
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

      // Save Full Name and Password in localStorage
      // These will be checked again when the user logs in
      localStorage.setItem("stuFullName", fullname);
      localStorage.setItem("stuPassword", password);

      console.log("Sign Up successful. Full Name saved: " + fullname);

      // Redirect to login page after successful signup
      // signup.html is inside pages/ so index.html is one level up
      window.location.href = "../index.html";

    });
  }


  // =============================================
  // SIGN IN BUTTON — index.html
  // Checks entered Full Name and Password against
  // values stored in localStorage during signup.
  // If correct → goes to dashboard
  // If wrong   → shows alert
  // =============================================
  const signinBtn = document.getElementById("signinBtn");

  if (signinBtn) {
    signinBtn.addEventListener("click", function () {

      // The username field is used to enter Full Name on login
      const enteredName     = document.getElementById("username").value.trim();
      const enteredPassword = document.getElementById("password").value.trim();

      // Make sure both fields are filled in
      if (enteredName === "" || enteredPassword === "") {
        alert("Please enter both your Full Name and password.");
        return;
      }

      // Get the stored Full Name and Password from localStorage
      const storedName     = localStorage.getItem("stuFullName");
      const storedPassword = localStorage.getItem("stuPassword");

      // Check if a registered account exists
      if (storedName === null || storedPassword === null) {
        alert("No account found. Please register first.");
        return;
      }

      // Compare entered values with stored values
      if (enteredName === storedName && enteredPassword === storedPassword) {

        // Login is correct — set the logged in flag and go to dashboard
        console.log("Login successful. Welcome, " + storedName);
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "pages/dashboard.html";

      } else {

        // Login is wrong — show error message
        console.log("Login failed. Incorrect details entered.");
        alert("Invalid login details. Please check your Full Name and password.");

      }

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
  // GET STARTED BUTTON — landing.html
  // Redirects to signup page
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
  // Clears stored data and redirects to login page
  // =============================================
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      console.log("User logged out. Clearing stored data...");
      // Remove stored name, password, and login flag on logout
      localStorage.removeItem("stuFullName");
      localStorage.removeItem("stuPassword");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "../index.html";
    });
  }


  // =============================================
  // DASHBOARD PROTECTION — pages/dashboard.html
  // If user is not logged in, redirect to login.
  // This stops anyone from accessing the dashboard
  // directly without going through login first.
  // =============================================
  const topbarGreeting    = document.getElementById("topbarGreeting");
  const welcomeBannerName = document.getElementById("welcomeBannerName");

  // Only run if we are on the dashboard page
  if (topbarGreeting || welcomeBannerName) {

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      // Not logged in — redirect back to login page
      console.log("Access denied. Redirecting to login...");
      window.location.href = "../index.html";
      return; // Stop the rest of the code from running
    }

    // Logged in — get the saved Full Name and display it
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