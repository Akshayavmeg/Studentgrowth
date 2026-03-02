// ============================================================
//   STUGROWTH — script.js
//   Handles: Signup, Login, Logout,
//            Dashboard grade entry + auto-analysis,
//            Plan page display
//
//   FLOW:
//   1. Signup  → save Full Name, Class, Password → go to login
//   2. Login   → check credentials → set isLoggedIn → dashboard
//   3. Dashboard → load subjects by class → enter marks per subject
//                → click "Analyse Performance" → calculate average
//                → classify Slow / Average / Fast → save → plan.html
//   4. Plan    → read saved data → show profile + personalised plan
//   5. Logout  → clear data → go to login
// ============================================================

window.onload = function () {

  // ============================================================
  //  SIGNUP — pages/signup.html
  //  Fields: fullname, stu-class, password, confirm-password
  //  Saves: stuFullName, stuClass, stuPassword
  // ============================================================
  var signupBtn = document.getElementById('signupBtn');

  if (signupBtn) {
    signupBtn.addEventListener('click', function () {

      var fullname  = document.getElementById('fullname').value.trim();
      var stuClass  = document.getElementById('stu-class').value;
      var password  = document.getElementById('password').value.trim();
      var confirm   = document.getElementById('confirm-password').value.trim();

      // Validate all fields filled
      if (!fullname || !stuClass || !password || !confirm) {
        alert('Please fill in all fields before signing up.');
        return;
      }

      // Passwords must match
      if (password !== confirm) {
        alert('Passwords do not match. Please try again.');
        return;
      }

      // Save to localStorage
      localStorage.setItem('stuFullName', fullname);
      localStorage.setItem('stuClass',    stuClass);
      localStorage.setItem('stuPassword', password);

      console.log('Signup OK — Name:', fullname, '| Class:', stuClass);

      // Go to login page
      window.location.href = '../index.html';
    });
  }


  // ============================================================
  //  LOGIN — index.html
  //  Fields: username (= Full Name), password
  //  Validates against localStorage, sets isLoggedIn
  // ============================================================
  var signinBtn = document.getElementById('signinBtn');

  if (signinBtn) {
    signinBtn.addEventListener('click', function () {

      var enteredName = document.getElementById('username').value.trim();
      var enteredPass = document.getElementById('password').value.trim();

      if (!enteredName || !enteredPass) {
        alert('Please enter your Full Name and password.');
        return;
      }

      var storedName = localStorage.getItem('stuFullName');
      var storedPass = localStorage.getItem('stuPassword');

      // Check account exists
      if (!storedName || !storedPass) {
        alert('No account found. Please register first.');
        return;
      }

      // Validate credentials
      if (enteredName === storedName && enteredPass === storedPass) {
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Login OK. Welcome,', storedName);
        window.location.href = 'pages/dashboard.html';
      } else {
        alert('Incorrect Full Name or password. Please try again.');
      }
    });
  }


  // ============================================================
  //  CREATE ACCOUNT LINK — index.html
  // ============================================================
  var createAccountLink = document.getElementById('createAccountLink');
  if (createAccountLink) {
    createAccountLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'pages/signup.html';
    });
  }


  // ============================================================
  //  GET STARTED — landing.html
  // ============================================================
  var getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function () {
      window.location.href = 'pages/signup.html';
    });
  }


  // ============================================================
  //  LOGOUT — dashboard.html, plan.html
  //  Clears all stored data and goes back to login
  // ============================================================
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.clear();
      console.log('Logged out. All data cleared.');
      window.location.href = '../index.html';
    });
  }


  // ============================================================
  //  DASHBOARD — pages/dashboard.html
  //  1. Protect page (redirect if not logged in)
  //  2. Show student name + class
  //  3. Build subject grade inputs based on class
  //  4. "Analyse Performance" → calculate avg, classify, save, redirect
  // ============================================================
  var gradeForm = document.getElementById('gradeForm');

  if (gradeForm) {

    // -- Protect page --
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = '../index.html';
      return;
    }

    var fullName = localStorage.getItem('stuFullName') || 'Student';
    var stuClass = localStorage.getItem('stuClass')    || '';

    // -- Update topbar greeting --
    var topbarGreeting = document.getElementById('topbarGreeting');
    if (topbarGreeting) topbarGreeting.textContent = 'Hello, ' + fullName + ' 👋';

    // -- Update avatar initial --
    var topbarAvatar = document.getElementById('topbarAvatar');
    if (topbarAvatar) topbarAvatar.textContent = fullName.charAt(0).toUpperCase();

    // -- Update welcome banner --
    var bannerName = document.getElementById('bannerName');
    if (bannerName) bannerName.textContent = 'Welcome back, ' + fullName + '! 🎓';

    // -- Show class badge --
    var classBadge = document.getElementById('classBadge');
    if (classBadge) classBadge.textContent = stuClass || 'Unknown Class';

    // -- Build grade inputs based on class --
    var subjects = getSubjectsByClass(stuClass);
    var gradeInputsContainer = document.getElementById('gradeInputs');

    if (gradeInputsContainer) {
      gradeInputsContainer.innerHTML = ''; // clear any old inputs

      for (var i = 0; i < subjects.length; i++) {
        var subject = subjects[i];
        var safeId  = 'marks_' + i; // safe HTML id

        // Create one row per subject
        var row = document.createElement('div');
        row.className = 'grade-row';
        row.innerHTML =
          '<div class="grade-subject-name">' +
            '<span class="grade-subject-icon">📘</span>' +
            '<span>' + subject + '</span>' +
          '</div>' +
          '<div class="grade-input-wrap">' +
            '<input ' +
              'type="number" ' +
              'id="' + safeId + '" ' +
              'class="grade-input" ' +
              'placeholder="0–100" ' +
              'min="0" max="100" ' +
              'data-subject="' + subject + '"' +
            ' />' +
            '<span class="grade-unit">/ 100</span>' +
          '</div>';

        gradeInputsContainer.appendChild(row);
      }

      // -- Attach live-update listener after inputs are built --
      // Event delegation on container fires on every keystroke in any input
      gradeInputsContainer.addEventListener('input', updateInsightCard);
    }

    // -- "Analyse Performance" button --
    var analyseBtn = document.getElementById('analyseBtn');
    if (analyseBtn) {
      analyseBtn.addEventListener('click', function () {

        // Collect all grade inputs
        var inputs = document.querySelectorAll('.grade-input');
        var subjectMarks = {}; // { SubjectName: marks }
        var total        = 0;
        var count        = inputs.length;
        var allFilled    = true;

        for (var j = 0; j < inputs.length; j++) {
          var input   = inputs[j];
          var subName = input.getAttribute('data-subject');
          var val     = input.value.trim();

          // Check filled
          if (val === '') {
            allFilled = false;
            break;
          }

          var numVal = parseInt(val);

          // Check valid range
          if (isNaN(numVal) || numVal < 0 || numVal > 100) {
            alert('Please enter marks between 0 and 100 for all subjects.');
            return;
          }

          subjectMarks[subName] = numVal;
          total += numVal;
        }

        if (!allFilled) {
          alert('Please fill in marks for all subjects before analysing.');
          return;
        }

        // ── Calculate average ─────────────────────────────────────
        var average = Math.round(total / count);

        // ── IQ Score formula: IQ = 70 + (average × 0.6) ──────────
        //    Average  0 → IQ  70
        //    Average 50 → IQ 100
        //    Average 80 → IQ 118
        //    Average 100→ IQ 130
        var iqScore = Math.round(70 + (average * 0.6));

        // ── Classify level by IQ score ────────────────────────────
        //    IQ  < 95   → Slow Learner
        //    IQ 95–115  → Average Learner
        //    IQ  > 115  → Fast Learner
        var learnerLevel = '';
        if (iqScore < 95) {
          learnerLevel = 'Slow Learner';
        } else if (iqScore <= 115) {
          learnerLevel = 'Average Learner';
        } else {
          learnerLevel = 'Fast Learner';
        }

        console.log('Average:', average, '| IQ Score:', iqScore, '| Level:', learnerLevel);

        // Save all data to localStorage
        localStorage.setItem('planName',         fullName);
        localStorage.setItem('planClass',        stuClass);
        localStorage.setItem('planSubjectMarks', JSON.stringify(subjectMarks));
        localStorage.setItem('planAverage',      average);
        localStorage.setItem('planIQ',           iqScore);
        localStorage.setItem('planLevel',        learnerLevel);

        // Go to plan page
        window.location.href = 'plan.html';
      });
    }

  } // end dashboard block


  // ============================================================
  //  PLAN PAGE — pages/plan.html
  //  Reads saved data, displays profile + personalised plan
  // ============================================================
  var planSections = document.getElementById('planSections');

  if (planSections) {

    // -- Protect page --
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = '../index.html';
      return;
    }

    // -- Read saved values --
    var planName    = localStorage.getItem('planName')         || 'Student';
    var planClass   = localStorage.getItem('planClass')        || 'Unknown Class';
    var planAvg     = parseInt(localStorage.getItem('planAverage')) || 0;
    var planLevel   = localStorage.getItem('planLevel')        || 'Average Learner';
    var marksJSON   = localStorage.getItem('planSubjectMarks') || '{}';
    var subjectMarks = JSON.parse(marksJSON);

    // -- Update topbar --
    var planGreeting = document.getElementById('topbarGreeting');
    if (planGreeting) planGreeting.textContent = 'Hello, ' + planName + ' 👋';

    var planAvatar = document.getElementById('topbarAvatar');
    if (planAvatar) planAvatar.textContent = planName.charAt(0).toUpperCase();

    // -- Fill profile card --
    var profileName  = document.getElementById('profileName');
    var profileClass = document.getElementById('profileClass');
    var profileAvg   = document.getElementById('profileAvg');
    var profileLevel = document.getElementById('profileLevel');
    if (profileName)  profileName.textContent  = planName;
    if (profileClass) profileClass.textContent = planClass;
    if (profileAvg)   profileAvg.textContent   = planAvg + ' / 100';
    if (profileLevel) profileLevel.textContent = planLevel;

    // -- Fill subject marks table --
    var subjectTableBody = document.getElementById('subjectTableBody');
    if (subjectTableBody) {
      var tableHTML = '';
      for (var subj in subjectMarks) {
        if (subjectMarks.hasOwnProperty(subj)) {
          var m = subjectMarks[subj];
          var statusIcon =
            m < 40  ? '🔴' :
            m <= 75 ? '🟡' : '🟢';
          var statusLabel =
            m < 40  ? 'Needs Work' :
            m <= 75 ? 'Moderate'   : 'Strong';
          tableHTML +=
            '<tr>' +
              '<td>' + subj + '</td>' +
              '<td><strong>' + m + ' / 100</strong></td>' +
              '<td>' + statusIcon + ' ' + statusLabel + '</td>' +
            '</tr>';
        }
      }
      subjectTableBody.innerHTML = tableHTML;
    }

    // -- Set level badge colour --
    var levelBadge = document.getElementById('levelBadge');
    if (levelBadge) {
      levelBadge.textContent = planLevel;
      if (planLevel === 'Slow Learner') {
        levelBadge.className = 'level-badge slow';
      } else if (planLevel === 'Average Learner') {
        levelBadge.className = 'level-badge average';
      } else {
        levelBadge.className = 'level-badge fast';
      }
    }

    // -- Generate personalised plan cards --
    var plan = getPlanContent(planLevel, planClass);
    planSections.innerHTML =
      buildPlanCard('📅', 'Daily Study Routine',    plan.dailyRoutine) +
      buildPlanCard('📋', 'Weekly Study Plan',      plan.weeklyPlan)   +
      buildPlanCard('💡', 'Tips & Strategy',        plan.tips)         +
      buildCourseCard(planLevel, planClass);
  }


  // ============================================================
  //  HELPER: Returns subjects list for a given class
  // ============================================================
  function getSubjectsByClass(cls) {
    var map = {
      '10th Class':       ['Mathematics', 'Science', 'English', 'Social Studies'],
      '11th Class':       ['Mathematics', 'Physics', 'Chemistry', 'English', 'Economics'],
      '12th Class':       ['Mathematics', 'Physics', 'Chemistry', 'English', 'Economics'],
      'B.Tech 1st Year':  ['Mathematics', 'Physics', 'Programming (C/C++)', 'Electrical Basics'],
      'B.Tech 2nd Year':  ['Data Structures', 'Mathematics', 'Electronics', 'Object Oriented Programming'],
      // Fallback for any other class
      '8th Class':        ['Mathematics', 'Science', 'English', 'Social Studies'],
      '9th Class':        ['Mathematics', 'Science', 'English', 'Social Studies'],
      'B.Tech 3rd Year':  ['Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks'],
      'B.Tech 4th Year':  ['Machine Learning', 'Cloud Computing', 'Advanced Algorithms', 'Elective Subject'],
      'Diploma 1st Year': ['Mathematics', 'Physics', 'Workshop Practice', 'Basic Electronics'],
      'Diploma 2nd Year': ['Applied Mathematics', 'Electrical Circuits', 'Computer Basics', 'Mechanical Drawing']
    };
    return map[cls] || ['Mathematics', 'Science', 'English', 'General Studies'];
  }


  // ============================================================
  //  HELPER: Builds one plan card HTML string
  // ============================================================
  function buildPlanCard(icon, title, steps) {
    var stepsHTML = '';
    for (var i = 0; i < steps.length; i++) {
      stepsHTML +=
        '<div class="plan-step">' +
          '<div class="plan-step-num">' + (i + 1) + '</div>' +
          '<div class="plan-step-content">' +
            '<p class="plan-step-title">'  + steps[i].title  + '</p>' +
            '<p class="plan-step-detail">' + steps[i].detail + '</p>' +
          '</div>' +
        '</div>';
    }
    return (
      '<div class="plan-card">' +
        '<div class="plan-card-header">' +
          '<span class="plan-card-icon">' + icon  + '</span>' +
          '<h2 class="plan-card-title">'  + title + '</h2>' +
        '</div>' +
        '<div class="plan-steps">' + stepsHTML + '</div>' +
      '</div>'
    );
  }


  // ============================================================
  //  HELPER: Returns plan content object based on learner level
  // ============================================================
  function getPlanContent(level, cls) {

    if (level === 'Slow Learner') {
      return {
        dailyRoutine: [
          { title: 'Study 1–2 Hours Daily', detail: 'Shorter sessions help slow learners retain information better. Study 1 to 2 hours each day with a 10-minute break every 30 minutes.' },
          { title: 'Start with the Basics', detail: 'Do not move to new topics until you are confident with the current one. Re-read the same chapter multiple times if needed.' },
          { title: 'Write Notes by Hand', detail: 'Handwriting notes improves memory. After reading a topic, write down 5 key points in your own words.' },
          { title: 'Revise Before Sleeping', detail: 'Spend 10 minutes reading your notes before bed every night. Your brain processes and stores information while you sleep.' }
        ],
        weeklyPlan: [
          { title: 'Monday & Tuesday — Learn',   detail: 'Slowly study one new topic. Read it once, then read it again. Write down anything you don\'t understand.' },
          { title: 'Wednesday — Revise',          detail: 'Go back over Monday and Tuesday\'s topics. Re-read your notes and highlight the most important points.' },
          { title: 'Thursday & Friday — Practice', detail: 'Solve 2 to 3 simple questions on each topic you studied. Ask your teacher if you are stuck.' },
          { title: 'Saturday — Full Revision',    detail: 'Re-read all notes from this week. Redo any questions you got wrong. Make a simple summary sheet.' },
          { title: 'Sunday — Rest',               detail: 'Complete rest. No studying today. Let your brain absorb everything from the week.' }
        ],
        tips: [
          { title: 'Be Patient with Yourself',  detail: 'Learning takes time. Everyone moves at a different pace — what matters is that you keep going. Never give up.' },
          { title: 'Use Diagrams and Colours',   detail: 'Draw pictures, flowcharts, or use coloured pens when taking notes. Visual learners remember better through images.' },
          { title: 'Ask for Help Immediately',   detail: 'If you do not understand something, ask your teacher the same day. Do not wait — confusion grows quickly.' },
          { title: 'Celebrate Small Wins',       detail: 'Every topic you finish, every question you get right — these are real achievements. Reward yourself and build confidence.' }
        ]
      };

    } else if (level === 'Average Learner') {
      return {
        dailyRoutine: [
          { title: 'Study 2–3 Hours Daily', detail: 'Split your time: 1 hour in the morning and 1–2 hours in the evening. Keep a consistent routine every day including weekends.' },
          { title: 'Morning Warm-Up (15 min)', detail: 'Start each session by spending 15 minutes reading yesterday\'s notes before starting new material.' },
          { title: 'Core Study Block', detail: 'Spend the main block on your weakest subject first — when your energy is highest. Take notes as you go.' },
          { title: 'Evening Practice', detail: 'Solve 5 to 8 practice questions every evening. Focus specifically on the types of questions you got wrong before.' }
        ],
        weeklyPlan: [
          { title: 'Monday–Wednesday — Learn',   detail: 'Cover new chapters and topics. Read carefully, take notes, and highlight key formulas or definitions.' },
          { title: 'Thursday–Friday — Practice', detail: 'Solve past paper questions. Attempt at least one full question set per subject each day.' },
          { title: 'Saturday — Revision',        detail: 'Revise the full week. Rewrite key points in your own words. Make a one-page summary sheet per subject.' },
          { title: 'Sunday — Light Review',      detail: 'Rest, but spend 20 minutes reading your summary sheets. Optionally watch a short video on one topic.' }
        ],
        tips: [
          { title: 'Target Your Weak Topics First', detail: 'List the 2 or 3 topics where you lose the most marks in each subject. Study those first every week.' },
          { title: 'Practise Under Time Pressure',  detail: 'Set a 30-minute timer and solve questions without looking at the textbook. This builds exam speed and confidence.' },
          { title: 'Use Past Papers',               detail: 'Solve 2 to 3 years of past exam papers. They reveal the exact question types and patterns that examiners prefer.' },
          { title: 'Improve Week by Week',          detail: 'Do not try to improve everything at once. Pick one subject per week to focus on deeply and improve it steadily.' }
        ]
      };

    } else {
      // Fast Learner
      return {
        dailyRoutine: [
          { title: 'Study 3–5 Hours Daily', detail: 'Fast learners can handle long study sessions. Study 3 to 5 hours daily, split into two focused blocks with a proper break in between.' },
          { title: 'Cover 2–3 Topics Per Session', detail: 'Do not just read one topic per day. Push yourself to cover 2 to 3 chapters or advanced topics in each session.' },
          { title: 'Timed Problem Solving', detail: 'Set a 20-minute timer and solve as many questions as possible. Track your score each day and try to beat yesterday\'s count.' },
          { title: 'Teach to Reinforce', detail: 'After finishing a topic, explain it out loud as if you are teaching someone. Teaching exposes gaps in your own understanding.' }
        ],
        weeklyPlan: [
          { title: 'Monday–Wednesday — Advanced Topics', detail: 'Study complex, high-weightage chapters and go beyond the standard syllabus. Explore advanced examples and proofs.' },
          { title: 'Thursday — Full Mock Test',           detail: 'Attempt a complete timed mock test covering all subjects. Simulate real exam conditions — no interruptions.' },
          { title: 'Friday — Error Analysis',             detail: 'Review every single mistake from Thursday\'s test. Understand why each error happened and how to avoid it.' },
          { title: 'Saturday — Challenge Problems',       detail: 'Attempt olympiad-level or competitive exam problems. Push beyond what is comfortable.' },
          { title: 'Sunday — Plan & Rest',                detail: 'Review this week\'s progress and set specific targets for next week. Rest in the afternoon.' }
        ],
        tips: [
          { title: 'Depth Over Speed',          detail: 'Fast learners often rush. Make sure you truly understand every concept deeply — not just memorise it on the surface.' },
          { title: 'Explore Beyond Textbooks',  detail: 'Read reference books, university notes, or watch MIT/IIT lecture videos. Go far beyond what your syllabus requires.' },
          { title: 'Help Your Classmates',      detail: 'Teaching others is the highest form of learning. Helping slower classmates deepens your own understanding significantly.' },
          { title: 'Set Competitive Goals',     detail: 'Aim for top ranks, olympiads, or entrance exam cutoffs. Having a big goal keeps a fast learner sharp and motivated.' }
        ]
      };
    }
  }


  // ============================================================
  //  HELPER: Builds recommended courses card
  //  Based on learner level and class
  // ============================================================
  function buildCourseCard(level, cls) {
    var courses = getRecommendedCourses(level, cls);
    var coursesHTML = '';
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      coursesHTML +=
        '<div class="course-item">' +
          '<div class="course-item-icon">' + c.icon + '</div>' +
          '<div class="course-item-body">' +
            '<p class="course-item-title">'    + c.title    + '</p>' +
            '<p class="course-item-platform">' + c.platform + '</p>' +
            '<p class="course-item-desc">'     + c.desc     + '</p>' +
          '</div>' +
        '</div>';
    }
    return (
      '<div class="plan-card">' +
        '<div class="plan-card-header">' +
          '<span class="plan-card-icon">🎓</span>' +
          '<h2 class="plan-card-title">Recommended Courses</h2>' +
        '</div>' +
        '<div class="course-list">' + coursesHTML + '</div>' +
      '</div>'
    );
  }


  // ============================================================
  //  HELPER: Returns recommended courses for level + class
  // ============================================================
  function getRecommendedCourses(level, cls) {

    // Engineering / B.Tech courses
    if (cls.indexOf('B.Tech') !== -1 || cls.indexOf('Diploma') !== -1) {
      if (level === 'Slow Learner') {
        return [
          { icon: '🎬', title: 'Programming Basics for Beginners',     platform: 'YouTube (Apna College)',       desc: 'Start from zero — variables, loops, functions. Watch slowly and code along.' },
          { icon: '📐', title: 'Engineering Mathematics — Foundation', platform: 'NPTEL Free Course',             desc: 'Clear basics of calculus, matrices, and integration with step-by-step examples.' },
          { icon: '⚡', title: 'Basic Electrical Engineering',          platform: 'Khan Academy (Free)',           desc: 'Understand circuits, voltage, and current with interactive exercises.' },
          { icon: '📚', title: 'Study Skills for Engineering Students', platform: 'Coursera (Audit Free)',         desc: 'Learn how to read textbooks, take notes, and manage your time as an engineering student.' }
        ];
      } else if (level === 'Average Learner') {
        return [
          { icon: '💻', title: 'Data Structures and Algorithms',        platform: 'GeeksforGeeks / YouTube',      desc: 'Practice arrays, linked lists, stacks, and recursion with solved examples.' },
          { icon: '📐', title: 'Engineering Maths — Problem Solving',   platform: 'NPTEL Free Course',             desc: 'Practice-focused course on differential equations, transforms, and probability.' },
          { icon: '🔧', title: 'Object Oriented Programming (Java/C++)',  platform: 'Udemy (Free Trial)',           desc: 'Learn classes, objects, inheritance, and polymorphism with coding projects.' },
          { icon: '🌐', title: 'Computer Networks Basics',              platform: 'YouTube (Gate Smashers)',       desc: 'Understand OSI model, TCP/IP, and protocols clearly with visual diagrams.' }
        ];
      } else {
        return [
          { icon: '🤖', title: 'Machine Learning with Python',          platform: 'Coursera — Andrew Ng (Free Audit)', desc: 'Learn regression, classification, neural networks. The best ML course available.' },
          { icon: '💡', title: 'Competitive Programming',               platform: 'Codeforces / LeetCode',         desc: 'Solve 3 problems daily. Start from Easy, move to Medium and Hard systematically.' },
          { icon: '☁️', title: 'Cloud Computing — AWS / Azure',         platform: 'AWS Free Tier + Coursera',      desc: 'Get hands-on with real cloud deployments. Earn a free certification.' },
          { icon: '📊', title: 'System Design and Architecture',         platform: 'GitHub (System Design Primer)', desc: 'Prepare for top tech company interviews by learning scalable system design.' }
        ];
      }
    }

    // School — 10th, 11th, 12th
    if (level === 'Slow Learner') {
      return [
        { icon: '🎬', title: 'Maths Basics — Class 10',               platform: 'YouTube (Vedantu / Byju\'s)',   desc: 'Short videos (10–15 min) on each chapter. Watch the same video twice until it is clear.' },
        { icon: '🔬', title: 'Science Fundamentals for Beginners',     platform: 'Khan Academy (Free)',           desc: 'Interactive lessons on physics, chemistry, and biology from complete scratch.' },
        { icon: '📝', title: 'English Grammar Foundation',             platform: 'YouTube (Dear Sir)',            desc: 'Learn sentence structure, grammar rules, and writing skills step by step.' },
        { icon: '📖', title: 'NCERT Reading Plan — Chapter by Chapter', platform: 'NCERT Website (Free PDF)',      desc: 'Follow the NCERT textbooks carefully, chapter by chapter, before touching any guide.' }
      ];
    } else if (level === 'Average Learner') {
      return [
        { icon: '📐', title: 'Mathematics — Practice Problems',         platform: 'YouTube (Vedantu CBSE)',        desc: 'Watch solved examples, then try on your own. Focus on topics with the most exam weightage.' },
        { icon: '🔬', title: 'Physics & Chemistry — Concept Clarity',   platform: 'Khan Academy / NCERT',          desc: 'Master derivations and chemical equations with visual and animated explanations.' },
        { icon: '📄', title: 'Board Exam Previous Papers',              platform: 'CBSE Official Website',         desc: 'Solve last 5 years of board papers. Check the answer key and analyse every mistake.' },
        { icon: '✏️', title: 'Vocabulary & Essay Writing',              platform: 'YouTube (Iken Edu)',            desc: 'Build your English writing skills — structure, vocabulary, and grammar for board exams.' }
      ];
    } else {
      return [
        { icon: '🏆', title: 'JEE / NEET Foundation Course',            platform: 'Unacademy / PW App (Free)',     desc: 'Start competitive exam preparation early with structured courses from top teachers.' },
        { icon: '📐', title: 'Advanced Mathematics — IIT Level',        platform: 'YouTube (Nexa Classes)',        desc: 'Solve JEE-level maths problems. Focus on speed, accuracy, and shortcut techniques.' },
        { icon: '🔭', title: 'Science Olympiad Preparation',            platform: 'Olympiad Tester Website',       desc: 'Attempt Science Olympiad practice tests to go beyond the school syllabus.' },
        { icon: '💬', title: 'Advanced English — Writing & Reading',    platform: 'Coursera (Michigan University)', desc: 'Prepare for higher studies by strengthening academic reading and writing skills.' }
      ];
    }
  }

  // ============================================================
  //  LIVE INSIGHT CARD — pages/dashboard.html
  //  Called on every 'input' event inside #gradeInputs.
  //  Recalculates average → IQ → level and updates the three
  //  right-panel values in real time with no page reload.
  //
  //  IQ Formula : IQ = 70 + (average × 0.6)
  //  Level rules: IQ  < 95   → Slow Learner
  //               IQ 95–115  → Average Learner
  //               IQ  > 115  → Fast Learner
  // ============================================================
  function updateInsightCard() {

    var inputs = document.querySelectorAll('.grade-input');
    if (!inputs.length) return;

    var total  = 0;
    var filled = 0;

    // Sum every valid input (0–100); skip blanks and invalid values
    for (var i = 0; i < inputs.length; i++) {
      var v = parseInt(inputs[i].value);
      if (!isNaN(v) && v >= 0 && v <= 100) {
        total  += v;
        filled += 1;
      }
    }

    var iqEl  = document.getElementById('insightIQ');
    var lvlEl = document.getElementById('insightLevel');
    var avgEl = document.getElementById('insightAvg');

    // If no valid marks yet → reset panel to dashes
    if (filled === 0) {
      if (iqEl)  { iqEl.textContent  = '--'; iqEl.className  = 'insight-value'; }
      if (lvlEl) { lvlEl.textContent = '--'; lvlEl.className = 'insight-value'; }
      if (avgEl) { avgEl.textContent = '--'; avgEl.className = 'insight-value'; }
      return;
    }

    // Calculate average from only the fields that have been filled
    var avg = Math.round(total / filled);

    // Apply IQ formula
    var iq = Math.round(70 + (avg * 0.6));

    // Classify by IQ
    var level = '';
    var levelIcon = '';
    if (iq < 95) {
      level     = 'Slow Learner';
      levelIcon = '🔴 ';
    } else if (iq <= 115) {
      level     = 'Average Learner';
      levelIcon = '🟡 ';
    } else {
      level     = 'Fast Learner';
      levelIcon = '🟢 ';
    }

    // Update the three insight card values and apply the gold 'live' style
    if (iqEl)  { iqEl.textContent  = iq;                      iqEl.className  = 'insight-value live'; }
    if (lvlEl) { lvlEl.textContent = levelIcon + level;        lvlEl.className = 'insight-value live'; }
    if (avgEl) { avgEl.textContent = avg + ' / 100';           avgEl.className = 'insight-value live'; }
  }


}; // end window.onload