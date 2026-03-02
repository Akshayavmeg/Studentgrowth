// =============================================
//   STUGROWTH — script.js
//   Complete navigation, validation, and plan logic
//
//   FLOW:
//   1. Signup  → saves Full Name, Class, Password → goes to login
//   2. Login   → checks credentials → sets isLoggedIn → goes to dashboard
//   3. Dashboard → shows class-based subject dropdown, marks input, learner level
//                → on Generate: saves all values → goes to plan.html
//   4. Plan    → reads all values → generates marks + level based plan
//   5. Logout  → clears all stored data → goes to login
// =============================================

window.onload = function () {

  console.log("Stugrowth loaded successfully!");

  var currentPage = window.location.pathname;
  console.log("Current page: " + currentPage);


  // =============================================
  // SIGN UP BUTTON — pages/signup.html
  // Saves Full Name, Class, and Password
  // then redirects to login page
  // =============================================
  var signupBtn = document.getElementById("signupBtn");

  if (signupBtn) {
    signupBtn.addEventListener("click", function () {

      var fullname        = document.getElementById("fullname").value.trim();
      var email           = document.getElementById("email").value.trim();
      var username        = document.getElementById("username").value.trim();
      var stuClass        = document.getElementById("stu-class").value;
      var password        = document.getElementById("password").value.trim();
      var confirmPassword = document.getElementById("confirm-password").value.trim();

      // Check all fields are filled
      if (!fullname || !email || !username || !stuClass || !password || !confirmPassword) {
        alert("Please fill in all the fields before signing up.");
        return;
      }

      // Check both passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      // Save to localStorage
      localStorage.setItem("stuFullName", fullname);
      localStorage.setItem("stuClass",    stuClass);
      localStorage.setItem("stuPassword", password);

      console.log("Signup OK. Name: " + fullname + " | Class: " + stuClass);

      // Redirect to login
      window.location.href = "../index.html";

    });
  }


  // =============================================
  // SIGN IN BUTTON — index.html
  // Validates Full Name + Password against
  // localStorage. If correct → dashboard.
  // =============================================
  var signinBtn = document.getElementById("signinBtn");

  if (signinBtn) {
    signinBtn.addEventListener("click", function () {

      var enteredName     = document.getElementById("username").value.trim();
      var enteredPassword = document.getElementById("password").value.trim();

      if (!enteredName || !enteredPassword) {
        alert("Please enter your Full Name and password.");
        return;
      }

      var storedName     = localStorage.getItem("stuFullName");
      var storedPassword = localStorage.getItem("stuPassword");

      if (!storedName || !storedPassword) {
        alert("No account found. Please register first.");
        return;
      }

      if (enteredName === storedName && enteredPassword === storedPassword) {
        localStorage.setItem("isLoggedIn", "true");
        console.log("Login OK. Welcome, " + storedName);
        window.location.href = "pages/dashboard.html";
      } else {
        alert("Invalid login details. Please check your Full Name and password.");
      }

    });
  }


  // =============================================
  // CREATE ACCOUNT LINK — index.html
  // =============================================
  var createAccountLink = document.getElementById("createAccountLink");

  if (createAccountLink) {
    createAccountLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "pages/signup.html";
    });
  }


  // =============================================
  // GET STARTED BUTTON — landing.html
  // =============================================
  var getStartedBtn = document.getElementById("getStartedBtn");

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", function () {
      window.location.href = "pages/signup.html";
    });
  }


  // =============================================
  // LOGOUT BUTTON — pages/dashboard.html & plan.html
  // =============================================
  var logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("stuFullName");
      localStorage.removeItem("stuClass");
      localStorage.removeItem("stuPassword");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("planName");
      localStorage.removeItem("planClass");
      localStorage.removeItem("planSubject");
      localStorage.removeItem("planMarks");
      localStorage.removeItem("planLevel");
      localStorage.removeItem("planGoal");
      localStorage.removeItem("planHours");
      console.log("Logged out. All data cleared.");
      window.location.href = "../index.html";
    });
  }


  // =============================================
  // DASHBOARD — pages/dashboard.html
  // Protection + topbar name + class-based subjects
  // + Generate Plan button
  // =============================================
  var topbarGreeting    = document.getElementById("topbarGreeting");
  var welcomeBannerName = document.getElementById("welcomeBannerName");

  if (topbarGreeting || welcomeBannerName) {

    // Protect: redirect if not logged in
    if (localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "../index.html";
      return;
    }

    var fullName  = localStorage.getItem("stuFullName") || "Student";
    var stuClass  = localStorage.getItem("stuClass")    || "";

    // Update topbar and banner
    if (topbarGreeting) {
      topbarGreeting.textContent = "Hello, " + fullName + " \uD83D\uDC4B";
    }
    if (welcomeBannerName) {
      welcomeBannerName.textContent = "Welcome back, " + fullName + "! \uD83C\uDF93";
    }

    // Auto-fill Full Name in the form
    var studentNameInput = document.getElementById("student-name");
    if (studentNameInput) {
      studentNameInput.value = fullName;
    }

    // Update avatar initial
    var dashAvatar = document.getElementById("topbarAvatar");
    if (dashAvatar && fullName.length > 0) {
      dashAvatar.textContent = fullName.charAt(0).toUpperCase();
    }

    // -- Show class badge in form --
    var classBadge = document.getElementById("classBadge");
    if (classBadge) {
      if (stuClass) {
        classBadge.innerHTML = "&#x1F393; " + stuClass;
      } else {
        classBadge.innerHTML = "&#x26A0;&#xFE0F; No class found — please <a href='../index.html' style='color:#b8892a'>re-register</a>";
      }
    }

    // -- Populate subject dropdown based on stored class --
    var subjectSelect = document.getElementById("weak-subject");
    if (subjectSelect && stuClass) {
      subjectSelect.innerHTML = '<option value="" disabled selected>Select subject</option>';

      var subjectMap = getSubjectsByClass(stuClass);

      for (var i = 0; i < subjectMap.length; i++) {
        var opt = document.createElement("option");
        opt.value = subjectMap[i];
        opt.textContent = subjectMap[i];
        subjectSelect.appendChild(opt);
      }
    }

    // -- Generate Plan button --
    var generatePlanBtn = document.getElementById("generatePlanBtn");
    if (generatePlanBtn) {
      generatePlanBtn.addEventListener("click", function () {

        var name    = document.getElementById("student-name").value.trim();
        var subject = document.getElementById("weak-subject").value;
        var marks   = document.getElementById("student-marks").value.trim();
        var level   = document.getElementById("learner-level").value;
        var goal    = document.getElementById("learning-goal").value;
        var hours   = document.getElementById("study-hours").value;

        if (!name || !subject || !marks || !level || !goal || !hours) {
          alert("Please fill in all Academic Information fields.");
          return;
        }

        // Validate marks is a number 0-100
        var marksNum = parseInt(marks);
        if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
          alert("Please enter valid marks between 0 and 100.");
          return;
        }

        // Save all plan values to localStorage
        localStorage.setItem("planName",    name);
        localStorage.setItem("planClass",   stuClass);
        localStorage.setItem("planSubject", subject);
        localStorage.setItem("planMarks",   marks);
        localStorage.setItem("planLevel",   level);
        localStorage.setItem("planGoal",    goal);
        localStorage.setItem("planHours",   hours);

        console.log("Plan saved. Redirecting to plan.html...");
        window.location.href = "plan.html";

      });
    }

  }


  // =============================================
  // PLAN PAGE — pages/plan.html
  // Reads all stored values, generates plan
  // based on marks + learner level
  // =============================================
  var planSections      = document.getElementById("planSections");
  var planSummaryStrip  = document.getElementById("planSummaryStrip");

  if (planSections) {

    // Protect: redirect if not logged in
    if (localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "../index.html";
      return;
    }

    // Read all stored values
    var planName    = localStorage.getItem("planName")    || "Student";
    var planClass   = localStorage.getItem("planClass")   || "your class";
    var planSubject = localStorage.getItem("planSubject") || "your subject";
    var planMarks   = parseInt(localStorage.getItem("planMarks"))  || 0;
    var planLevel   = localStorage.getItem("planLevel")   || "Average Learner";
    var planGoal    = localStorage.getItem("planGoal")    || "Exam Preparation";
    var planHours   = localStorage.getItem("planHours")   || "2 hours";

    // Determine marks category
    var marksCategory = "";
    var marksCategoryLabel = "";
    if (planMarks < 40) {
      marksCategory      = "weak";
      marksCategoryLabel = "Needs Improvement (Below 40%)";
    } else if (planMarks <= 75) {
      marksCategory      = "moderate";
      marksCategoryLabel = "Moderate (40%–75%)";
    } else {
      marksCategory      = "strong";
      marksCategoryLabel = "Strong (Above 75%)";
    }

    console.log("Plan page. Name:", planName, "| Marks:", planMarks, "| Level:", planLevel);

    // Update topbar greeting and avatar
    var planGreeting = document.getElementById("topbarGreeting");
    if (planGreeting) {
      planGreeting.textContent = "Hello, " + planName + " \uD83D\uDC4B";
    }
    var planAvatar = document.getElementById("topbarAvatar");
    if (planAvatar) {
      planAvatar.textContent = planName.charAt(0).toUpperCase();
    }

    // Update intro text
    var planIntroText = document.getElementById("planIntroText");
    if (planIntroText) {
      planIntroText.textContent =
        planName + "'s personalised plan for " + planClass +
        " | " + planSubject + " | Marks: " + planMarks + "/100 | " + planLevel;
    }

    // Level badge in eyebrow
    var levelBadge = document.getElementById("planLevelBadge");
    if (levelBadge) {
      levelBadge.textContent = planLevel;
    }

    // -- Marks strength banner --
    var marksBanner = document.getElementById("marksBanner");
    if (marksBanner) {
      var bannerIcon, bannerTitle, bannerDesc, bannerClass;
      if (marksCategory === "weak") {
        bannerClass = "weak";
        bannerIcon  = "&#x1F534;";
        bannerTitle = "Needs Improvement — Marks: " + planMarks + "/100";
        bannerDesc  = "Your plan is focused on building strong basics, daily revision, and slow-paced concept mastery in " + planSubject + ".";
      } else if (marksCategory === "moderate") {
        bannerClass = "moderate";
        bannerIcon  = "&#x1F7E1;";
        bannerTitle = "Moderate Performance — Marks: " + planMarks + "/100";
        bannerDesc  = "Your plan balances learning new topics with regular practice problems and weekly revision in " + planSubject + ".";
      } else {
        bannerClass = "strong";
        bannerIcon  = "&#x1F7E2;";
        bannerTitle = "Strong Performance — Marks: " + planMarks + "/100";
        bannerDesc  = "Your plan pushes toward advanced problems, competitive prep, and deep mastery in " + planSubject + ".";
      }
      marksBanner.innerHTML =
        '<div class="marks-banner ' + bannerClass + '">' +
          '<div class="marks-banner-icon">' + bannerIcon + '</div>' +
          '<div class="marks-banner-text">' +
            '<h3>' + bannerTitle + '</h3>' +
            '<p>' + bannerDesc + '</p>' +
          '</div>' +
        '</div>';
    }

    // Summary tags
    if (planSummaryStrip) {
      var levelIcon = planLevel === "Slow Learner" ? "&#x1F331;" :
                      planLevel === "Fast Learner" ? "&#x26A1;"  : "&#x1F4CA;";
      var marksIcon = marksCategory === "weak"     ? "&#x1F534;" :
                      marksCategory === "strong"   ? "&#x1F7E2;" : "&#x1F7E1;";

      planSummaryStrip.innerHTML =
        '<span class="plan-tag">&#x1F393; ' + planClass   + '</span>' +
        '<span class="plan-tag">&#x1F4D6; ' + planSubject + '</span>' +
        '<span class="plan-tag">' + marksIcon + ' ' + planMarks + '/100 — ' + marksCategoryLabel + '</span>' +
        '<span class="plan-tag">' + levelIcon + ' ' + planLevel + '</span>' +
        '<span class="plan-tag">&#x23F0; '  + planHours   + '/day</span>';
    }

    // =============================================
    // GENERATE PLAN CARDS
    // 3 cards: Student Profile, Study Plan, Tips
    // Content varies by: marksCategory + planLevel
    // =============================================

    // -- Card 1: Student Profile Summary --
    var card1 =
      '<div class="plan-card">' +
        '<div class="plan-card-header">' +
          '<span class="plan-card-icon">&#x1F393;</span>' +
          '<h2 class="plan-card-title">Student Profile</h2>' +
        '</div>' +
        '<div class="plan-steps">' +
          buildStep(1, "Name",        planName) +
          buildStep(2, "Class",       planClass) +
          buildStep(3, "Subject",     planSubject) +
          buildStep(4, "Marks",       planMarks + " / 100  —  " + marksCategoryLabel) +
          buildStep(5, "Learner Type", planLevel) +
          buildStep(6, "Daily Hours", planHours + " of focused study per day") +
        '</div>' +
      '</div>';

    // -- Card 2: Daily Study Plan (marks + level based) --
    var card2 = buildStudyPlanCard(planSubject, planMarks, planLevel, planHours, marksCategory);

    // -- Card 3: Weekly Plan (marks + level based) --
    var card3 = buildWeeklyPlanCard(planSubject, planMarks, planLevel, marksCategory);

    // -- Card 4: Personalised Recommendations --
    var card4 = buildRecommendationsCard(planSubject, planMarks, planLevel, planGoal, marksCategory);

    // Inject all cards
    planSections.innerHTML = card1 + card2 + card3 + card4;
  }


  // =============================================
  // HELPER: Builds a single step row
  // =============================================
  function buildStep(num, title, detail) {
    return (
      '<div class="plan-step">' +
        '<div class="plan-step-num">' + num + '</div>' +
        '<div class="plan-step-content">' +
          '<p class="plan-step-title">' + title + '</p>' +
          '<p class="plan-step-detail">' + detail + '</p>' +
        '</div>' +
      '</div>'
    );
  }


  // =============================================
  // HELPER: Returns subjects array for a given class
  // =============================================
  function getSubjectsByClass(cls) {
    var map = {
      "8th Class":        ["Mathematics", "Science", "English", "Social Studies", "Hindi"],
      "9th Class":        ["Mathematics", "Science", "English", "Social Studies", "Hindi"],
      "10th Class":       ["Mathematics", "Science", "English", "Social Studies", "Hindi"],
      "11th Class":       ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Economics"],
      "12th Class":       ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Economics"],
      "B.Tech 1st Year":  ["Mathematics", "Physics", "Programming (C/C++)", "Electrical Basics", "English"],
      "B.Tech 2nd Year":  ["Data Structures", "Mathematics", "Electronics", "Object Oriented Programming", "Digital Logic"],
      "B.Tech 3rd Year":  ["Algorithms", "Database Systems", "Operating Systems", "Computer Networks", "Software Engineering"],
      "B.Tech 4th Year":  ["Machine Learning", "Cloud Computing", "Project Management", "Advanced Algorithms", "Elective Subject"],
      "Diploma 1st Year": ["Mathematics", "Physics", "Workshop Practice", "English", "Basic Electronics"],
      "Diploma 2nd Year": ["Applied Mathematics", "Mechanical Drawing", "Electrical Circuits", "Computer Basics"]
    };
    return map[cls] || ["Mathematics", "Science", "English"];
  }


  // =============================================
  // HELPER: Daily Study Plan Card
  // =============================================
  function buildStudyPlanCard(subject, marks, level, hours, category) {
    var icon  = "&#x1F4C5;";
    var title = "Daily Study Plan";

    var step1, step2, step3, step4;

    if (category === "weak") {
      // Below 40 — basic concepts, slow pace, more revision
      step1 = buildStep(1, "Start with Basics",
        "Begin each session by reading the simplest introduction of " + subject + ". Don't skip to harder topics yet.");
      step2 = buildStep(2, "Short Study Blocks",
        "Study for 25 minutes, then take a 10-minute break. Repeat. Don't try to study for long hours at once.");
      step3 = buildStep(3, "Daily Revision",
        "Spend the last 20 minutes of each day re-reading everything you studied. Revision is more important than new topics right now.");
      step4 = buildStep(4, "One Question at a Time",
        "Solve just 2–3 easy practice questions on " + subject + " each day. Focus on understanding, not speed.");
    } else if (category === "moderate") {
      // 40–75 — balanced learning + practice
      step1 = buildStep(1, "Morning Warm-Up",
        "Spend 15 minutes reviewing yesterday's notes in " + subject + " before starting new material.");
      step2 = buildStep(2, "Core Study Block",
        "Dedicate " + hours + " to studying new topics in " + subject + ". Take short notes as you go.");
      step3 = buildStep(3, "Practice Problems",
        "Solve 5 to 8 practice questions from " + subject + " each day. Focus on weak areas.");
      step4 = buildStep(4, "Evening Recap",
        "Spend 10 minutes writing a short summary of what you learned — in your own words.");
    } else {
      // Above 75 — advanced pace, challenges
      step1 = buildStep(1, "Advanced Topic Deep Dive",
        "Cover 2 to 3 chapters or advanced topics in " + subject + " per session. Push beyond the syllabus.");
      step2 = buildStep(2, "Timed Problem Solving",
        "Set a 20-minute timer and solve as many problems as possible from " + subject + ". Track your score each day.");
      step3 = buildStep(3, "Explore Beyond Textbooks",
        "After finishing each topic, read one extra resource — video, article, or solved example — on " + subject + ".");
      step4 = buildStep(4, "Teach or Explain",
        "Explain today's topics out loud or to a friend. Teaching strengthens deep understanding.");
    }

    // Adjust intensity based on learner level
    var levelNote = "";
    if (level === "Slow Learner") {
      levelNote = buildStep(5, "Slow Learner Tip",
        "Don't rush. It is completely fine to spend 2–3 days on one topic. Understanding matters more than speed.");
    } else if (level === "Fast Learner") {
      levelNote = buildStep(5, "Fast Learner Tip",
        "Challenge yourself: after finishing today's plan early, attempt one harder bonus question from " + subject + ".");
    } else {
      levelNote = buildStep(5, "Average Learner Tip",
        "Balance is key. After completing your study block, take a proper break before attempting practice problems.");
    }

    return (
      '<div class="plan-card">' +
        '<div class="plan-card-header">' +
          '<span class="plan-card-icon">' + icon + '</span>' +
          '<h2 class="plan-card-title">' + title + '</h2>' +
        '</div>' +
        '<div class="plan-steps">' +
          step1 + step2 + step3 + step4 + levelNote +
        '</div>' +
      '</div>'
    );
  }


  // =============================================
  // HELPER: Weekly Study Plan Card
  // =============================================
  function buildWeeklyPlanCard(subject, marks, level, category) {
    var w1, w2, w3, w4, w5;

    if (category === "weak") {
      w1 = buildStep(1, "Monday & Tuesday — Learn",
        "Read and understand one basic concept from " + subject + ". Write down key points.");
      w2 = buildStep(2, "Wednesday — Revise",
        "Revise everything from Monday and Tuesday before touching anything new.");
      w3 = buildStep(3, "Thursday & Friday — Practice",
        "Solve 3–5 simple questions on the concept. Ask for help if stuck.");
      w4 = buildStep(4, "Saturday — Full Revision",
        "Review the entire week's work. Redo any questions you got wrong.");
      w5 = buildStep(5, "Sunday — Rest",
        "Complete rest. No studying today. Let your brain absorb everything from the week.");
    } else if (category === "moderate") {
      w1 = buildStep(1, "Monday – Wednesday — Learn",
        "Cover new topics in " + subject + ". Read carefully, take notes, and highlight important points.");
      w2 = buildStep(2, "Thursday – Friday — Practice",
        "Solve practice questions and attempt at least one past paper question set on the covered topics.");
      w3 = buildStep(3, "Saturday — Revision",
        "Revise the whole week. Rewrite key points in your own words. Make a one-page summary sheet.");
      w4 = buildStep(4, "Sunday — Light Review",
        "Rest, but spend 20 minutes reviewing your summary sheet. Watch a topic video if you feel like it.");
      w5 = "";
    } else {
      w1 = buildStep(1, "Monday – Wednesday — Advanced Topics",
        "Cover complex chapters and high-weightage topics in " + subject + ".");
      w2 = buildStep(2, "Thursday — Full Mock Test",
        "Attempt a timed, full-length mock test or past paper from " + subject + ".");
      w3 = buildStep(3, "Friday — Error Analysis",
        "Review every mistake from Thursday's test. Understand each error and fix your approach.");
      w4 = buildStep(4, "Saturday — Challenge Problems",
        "Attempt high-difficulty or olympiad-level problems in " + subject + " to push your limits.");
      w5 = buildStep(5, "Sunday — Target Setting",
        "Rest and plan next week's goals. Identify which topics to improve based on this week's test.");
    }

    return (
      '<div class="plan-card">' +
        '<div class="plan-card-header">' +
          '<span class="plan-card-icon">&#x1F5D3;&#xFE0F;</span>' +
          '<h2 class="plan-card-title">Weekly Study Plan</h2>' +
        '</div>' +
        '<div class="plan-steps">' +
          w1 + w2 + w3 + w4 + w5 +
        '</div>' +
      '</div>'
    );
  }


  // =============================================
  // HELPER: Personalised Recommendations Card
  // =============================================
  function buildRecommendationsCard(subject, marks, level, goal, category) {
    var r1, r2, r3, r4;

    // Based on marks category
    if (category === "weak") {
      r1 = buildStep(1, "Focus on Concepts First",
        "Do not attempt hard problems yet. Spend time understanding every basic concept in " + subject + " clearly.");
      r2 = buildStep(2, "Get Extra Help",
        "Ask your teacher to explain topics you don't understand. Don't stay stuck — seek help early.");
      r3 = buildStep(3, "Use Simple Study Resources",
        "Watch beginner-level YouTube videos on " + subject + " topics to build confidence.");
      r4 = buildStep(4, "Track Small Wins",
        "After every topic you complete, tick it off. Seeing progress builds motivation.");
    } else if (category === "moderate") {
      r1 = buildStep(1, "Identify Your Weak Topics",
        "List the 3 topics in " + subject + " where you lose the most marks. Target them first each week.");
      r2 = buildStep(2, "Use Past Papers",
        "Solve last year's exam questions on " + subject + ". They reveal the exact pattern and type of questions.");
      r3 = buildStep(3, "Improve Step-by-Step",
        "Don't try to master everything at once. Improve one topic per week until you're confident.");
      r4 = buildStep(4, "Practice Under Time Pressure",
        "Occasionally set a 30-minute timer and solve questions. Building speed is important for exams.");
    } else {
      r1 = buildStep(1, "Go Beyond the Syllabus",
        "Read advanced material on " + subject + " — research articles, university notes, or competitive guides.");
      r2 = buildStep(2, "Attempt Competitive Problems",
        "Try olympiad-level or entrance exam problems in " + subject + " to sharpen your analytical skills.");
      r3 = buildStep(3, "Teach Others",
        "Help a classmate with " + subject + ". Teaching reinforces your own understanding at a deep level.");
      r4 = buildStep(4, "Target Perfection",
        "Analyse every mistake — even one wrong answer. Understand exactly why, and make sure it never happens again.");
    }

    // Add one personalised goal-based tip
    var goalTip = "";
    if (goal === "Exam Preparation") {
      goalTip = buildStep(5, "Exam Tip",
        "Make a countdown chart to your exam date. Divide topics of " + subject + " across the available days.");
    } else if (goal === "Skill Building") {
      goalTip = buildStep(5, "Skill Tip",
        "Apply each concept you learn in " + subject + " to a mini project or real example to build practical skills.");
    } else if (goal === "Concept Clarity") {
      goalTip = buildStep(5, "Clarity Tip",
        "For every topic in " + subject + ", write a 3-sentence plain English explanation in your own words.");
    } else {
      goalTip = buildStep(5, "General Tip",
        "Set a clear, measurable weekly target for " + subject + " and review it every Sunday evening.");
    }

    return (
      '<div class="plan-card">' +
        '<div class="plan-card-header">' +
          '<span class="plan-card-icon">&#x1F4A1;</span>' +
          '<h2 class="plan-card-title">Personalised Recommendations</h2>' +
        '</div>' +
        '<div class="plan-steps">' +
          r1 + r2 + r3 + r4 + goalTip +
        '</div>' +
      '</div>'
    );
  }

};