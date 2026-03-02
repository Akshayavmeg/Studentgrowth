// ============================================================
//   STUGROWTH — script.js   (v2 — with Profile, Settings,
//   Progress Tracking, and Profile Dropdown)
//
//   localStorage keys:
//     stuFullName      – full name at signup
//     stuCollege       – college / institution
//     stuBranch        – CSE | ECE | MECH | CIVIL | EEE | IT
//     stuYear          – 1st Year … 4th Year
//     stuPassword      – hashed-style plain password (beginner)
//     isLoggedIn       – 'true' when authenticated
//     planName         – snapshot at analyse time
//     planCollege
//     planBranch
//     planYear
//     planSubjectMarks – JSON  { SubjectName: marks }
//     planAverage      – number
//     planIQ           – number
//     planLevel        – Slow Learner | Average Learner | Fast Learner
//     planWeak         – name of lowest-mark subject
//     quizScore        – e.g. "3/5"
//     quizLevel        – adjusted level after quiz
//     progressHistory  – JSON array of snapshot objects:
//                        { date, average, iq, level, weak, marks }
// ============================================================

window.onload = function () {

  // ──────────────────────────────────────────────────────────
  //  SHARED: TOPBAR — greeting + avatar on every page
  // ──────────────────────────────────────────────────────────
  var name = localStorage.getItem('stuFullName') || localStorage.getItem('planName') || 'Student';

  var topbarGreeting = document.getElementById('topbarGreeting');
  var topbarAvatar   = document.getElementById('topbarAvatar');
  if (topbarGreeting) topbarGreeting.textContent = 'Hello, ' + name.split(' ')[0] + ' 👋';
  if (topbarAvatar)   topbarAvatar.textContent   = name.charAt(0).toUpperCase();

  // ── Populate dropdown header ──────────────────────────────
  var ddName   = document.getElementById('ddName');
  var ddBranch = document.getElementById('ddBranch');
  if (ddName)   ddName.textContent   = name;
  if (ddBranch) {
    var b = localStorage.getItem('stuBranch') || '';
    var y = localStorage.getItem('stuYear')   || '';
    ddBranch.textContent = b && y ? b + ' · ' + y : (b || y || 'Student');
  }

  // ──────────────────────────────────────────────────────────
  //  SHARED: PROFILE DROPDOWN toggle
  // ──────────────────────────────────────────────────────────
  var avatar  = document.getElementById('topbarAvatar');
  var dropdown = document.getElementById('profileDropdown');

  if (avatar && dropdown) {
    avatar.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
    });

    dropdown.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  // ──────────────────────────────────────────────────────────
  //  SHARED: LOGOUT — sidebar button + dropdown button
  // ──────────────────────────────────────────────────────────
  function doLogout() {
    localStorage.clear();
    // Determine correct path based on current page depth
    var path = window.location.pathname;
    if (path.indexOf('/pages/') !== -1) {
      window.location.href = '../index.html';
    } else {
      window.location.href = 'index.html';
    }
  }

  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', doLogout);

  var dropdownLogout = document.getElementById('dropdownLogout');
  if (dropdownLogout) dropdownLogout.addEventListener('click', doLogout);


  // ══════════════════════════════════════════════════════════
  //  SIGNUP
  // ══════════════════════════════════════════════════════════
  var signupBtn = document.getElementById('signupBtn');
  if (signupBtn) {
    signupBtn.addEventListener('click', function () {
      var fullname = document.getElementById('fullname').value.trim();
      var college  = document.getElementById('college').value.trim();
      var branch   = document.getElementById('branch').value;
      var year     = document.getElementById('year').value;
      var password = document.getElementById('password').value.trim();
      var confirm  = document.getElementById('confirm-password').value.trim();

      if (!fullname || !college || !branch || !year || !password || !confirm) {
        alert('Please fill in all fields before signing up.'); return;
      }
      if (password !== confirm) {
        alert('Passwords do not match. Please try again.'); return;
      }

      localStorage.setItem('stuFullName', fullname);
      localStorage.setItem('stuCollege',  college);
      localStorage.setItem('stuBranch',   branch);
      localStorage.setItem('stuYear',     year);
      localStorage.setItem('stuPassword', password);

      window.location.href = '../index.html';
    });
  }


  // ══════════════════════════════════════════════════════════
  //  LOGIN
  // ══════════════════════════════════════════════════════════
  var signinBtn = document.getElementById('signinBtn');
  if (signinBtn) {
    signinBtn.addEventListener('click', function () {
      var enteredName = document.getElementById('username').value.trim();
      var enteredPass = document.getElementById('password').value.trim();

      if (!enteredName || !enteredPass) {
        alert('Please enter your Full Name and password.'); return;
      }

      var storedName = localStorage.getItem('stuFullName');
      var storedPass = localStorage.getItem('stuPassword');

      if (!storedName || !storedPass) {
        alert('No account found. Please register first.'); return;
      }

      if (enteredName === storedName && enteredPass === storedPass) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'pages/dashboard.html';
      } else {
        alert('Incorrect Full Name or password. Please try again.');
      }
    });
  }

  var createAccountLink = document.getElementById('createAccountLink');
  if (createAccountLink) {
    createAccountLink.addEventListener('click', function (e) {
      e.preventDefault(); window.location.href = 'pages/signup.html';
    });
  }

  var getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function () {
      window.location.href = 'pages/signup.html';
    });
  }


  // ══════════════════════════════════════════════════════════
  //  DASHBOARD
  // ══════════════════════════════════════════════════════════
  var gradeForm = document.getElementById('gradeForm');

  if (gradeForm) {

    // Protect
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = '../index.html'; return;
    }

    var fullName = localStorage.getItem('stuFullName') || 'Student';
    var college  = localStorage.getItem('stuCollege')  || 'Unknown College';
    var branch   = localStorage.getItem('stuBranch')   || 'CSE';
    var year     = localStorage.getItem('stuYear')     || '1st Year';

    // Update banner
    var bannerName = document.getElementById('bannerName');
    if (bannerName) bannerName.textContent = 'Welcome back, ' + fullName + '! 🎓';

    // Profile strip badges
    var profileStrip = document.getElementById('profileStrip');
    if (profileStrip) {
      profileStrip.innerHTML =
        badge('🎓', fullName)  +
        badge('🏛️', college)  +
        badge('🔬', branch)    +
        badge('📅', year);
    }

    // ── Load Progress Card ─────────────────────────────────
    var history = getProgressHistory();
    if (history.length > 0) {
      var last = history[history.length - 1];
      var progressCard = document.getElementById('progressCard');
      if (progressCard) progressCard.style.display = 'block';
      setEl('progIQ',   last.iq   || '--');
      setEl('progAvg',  last.average ? last.average + '/100' : '--');
      setEl('progWeak', last.weak || '--');
    }

    // Build subject inputs
    var subjects = getSubjectsByBranch(branch);
    var gradeInputsContainer = document.getElementById('gradeInputs');

    if (gradeInputsContainer) {
      gradeInputsContainer.innerHTML = '';
      for (var i = 0; i < subjects.length; i++) {
        var s   = subjects[i];
        var row = document.createElement('div');
        row.className = 'grade-row';
        row.innerHTML =
          '<div class="grade-subject-name">' +
            '<span class="grade-subject-icon">' + s.icon + '</span>' +
            '<span>' + s.name + '</span>' +
          '</div>' +
          '<div class="grade-input-wrap">' +
            '<input type="number" id="marks_' + i + '" class="grade-input" ' +
              'placeholder="0–100" min="0" max="100" data-subject="' + s.name + '" />' +
            '<span class="grade-unit">/ 100</span>' +
          '</div>';
        gradeInputsContainer.appendChild(row);
      }
      gradeInputsContainer.addEventListener('input', updateInsightCard);
    }

    // Generate Plan button
    var analyseBtn = document.getElementById('analyseBtn');
    if (analyseBtn) {
      analyseBtn.addEventListener('click', function () {
        var inputs       = document.querySelectorAll('.grade-input');
        var subjectMarks = {};
        var total = 0; var count = inputs.length;

        for (var j = 0; j < inputs.length; j++) {
          var inp     = inputs[j];
          var subName = inp.getAttribute('data-subject');
          var val     = inp.value.trim();
          if (val === '') { alert('Please fill in marks for all subjects.'); return; }
          var num = parseInt(val);
          if (isNaN(num) || num < 0 || num > 100) {
            alert('Marks must be between 0 and 100.'); return;
          }
          subjectMarks[subName] = num;
          total += num;
        }

        var average  = Math.round(total / count);
        var iqScore  = Math.round(70 + (average * 0.6));
        var level    = classifyLevel(iqScore);
        var weakSubj = findWeakSubject(subjectMarks);

        // Save plan data
        localStorage.setItem('planName',         fullName);
        localStorage.setItem('planCollege',      college);
        localStorage.setItem('planBranch',       branch);
        localStorage.setItem('planYear',         year);
        localStorage.setItem('planSubjectMarks', JSON.stringify(subjectMarks));
        localStorage.setItem('planAverage',      average);
        localStorage.setItem('planIQ',           iqScore);
        localStorage.setItem('planLevel',        level);
        localStorage.setItem('planWeak',         weakSubj);

        // ── Save to progress history ───────────────────────
        saveProgressEntry({
          date:    formatDate(new Date()),
          average: average,
          iq:      iqScore,
          level:   level,
          weak:    weakSubj,
          marks:   subjectMarks
        });

        window.location.href = 'plan.html';
      });
    }

    // Quiz button
    var quizBtn = document.getElementById('quizBtn');
    if (quizBtn) {
      quizBtn.addEventListener('click', function () {
        window.location.href = 'quiz.html';
      });
    }

  } // end dashboard


  // ══════════════════════════════════════════════════════════
  //  QUIZ PAGE
  // ══════════════════════════════════════════════════════════
  var questionCard = document.getElementById('questionCard');

  if (questionCard) {

    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = '../index.html'; return;
    }

    var branch = localStorage.getItem('stuBranch') || 'CSE';
    var quizDesc = document.getElementById('quizDesc');
    if (quizDesc) quizDesc.textContent = '5 questions based on ' + branch + '. Your result will adjust your learning level.';

    var questions = getQuizQuestions(branch);
    var currentQ  = 0;
    var score     = 0;
    var answered  = false;

    function renderQuestion(index) {
      answered = false;
      var q = questions[index];
      document.getElementById('questionNum').textContent  = 'QUESTION ' + (index + 1) + ' OF 5';
      document.getElementById('questionText').textContent = q.question;
      document.getElementById('progressText').textContent = 'Question ' + (index + 1) + ' of 5';
      document.getElementById('progressPct').textContent  = Math.round((index / 5) * 100) + '%';
      document.getElementById('progressFill').style.width = (index / 5 * 100) + '%';
      document.getElementById('nextBtn').style.display    = 'none';

      var letters   = ['A', 'B', 'C', 'D'];
      var container = document.getElementById('optionsContainer');
      container.innerHTML = '';

      for (var k = 0; k < q.options.length; k++) {
        (function (optionIndex) {
          var div = document.createElement('div');
          div.className = 'option';
          div.innerHTML =
            '<span class="option-letter">' + letters[optionIndex] + '</span>' +
            '<span>' + q.options[optionIndex] + '</span>';
          div.addEventListener('click', function () {
            if (answered) return;
            answered = true;
            var allOpts = container.querySelectorAll('.option');
            for (var m = 0; m < allOpts.length; m++) {
              allOpts[m].classList.add('disabled');
              if (m === q.correct)  allOpts[m].classList.add('correct');
              if (m === optionIndex && m !== q.correct) allOpts[m].classList.add('wrong');
              if (m === optionIndex) allOpts[m].classList.add('selected');
            }
            if (optionIndex === q.correct) score++;
            document.getElementById('nextBtn').style.display = 'block';
          });
          container.appendChild(div);
        })(k);
      }
    }

    renderQuestion(0);

    document.getElementById('nextBtn').addEventListener('click', function () {
      currentQ++;
      if (currentQ < 5) {
        renderQuestion(currentQ);
      } else {
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('progressPct').textContent  = '100%';
        document.getElementById('questionCard').style.display = 'none';
        document.getElementById('progressWrap').style.display = 'none';

        var existingLevel  = localStorage.getItem('planLevel') || 'Average Learner';
        var adjustedLevel  = adjustLevelByQuiz(score, existingLevel);
        localStorage.setItem('quizScore', score + '/5');
        localStorage.setItem('quizLevel', adjustedLevel);
        localStorage.setItem('planLevel', adjustedLevel);

        var rc = document.getElementById('resultCard');
        rc.style.display = 'block';

        var emoji     = score >= 4 ? '🏆' : score >= 2 ? '📚' : '💡';
        var labelText = score >= 4 ? 'Excellent! You have strong subject knowledge.' :
                        score >= 2 ? 'Good effort! Keep practising.' :
                                     'Keep studying — you\'ll get there!';

        document.getElementById('resultEmoji').textContent = emoji;
        document.getElementById('resultScore').textContent = score + '/5';
        document.getElementById('resultLabel').textContent = labelText;

        var rb = document.getElementById('resultLevelBadge');
        rb.textContent = adjustedLevel;
        rb.className   = 'level-badge ' + levelClass(adjustedLevel);

        var descMap = {
          'Slow Learner':    'Your quiz score suggests you need more practice on fundamentals. Your learning plan is on the Basic track — focused sessions, step-by-step explanations, and beginner-friendly courses.',
          'Average Learner': 'Your quiz score shows solid understanding with room to grow. Your plan is on the Balanced track — structured daily study, practice exercises, and intermediate courses.',
          'Fast Learner':    'Impressive! Your quiz performance shows strong conceptual understanding. Your plan is on the Advanced track — in-depth topics, competitive problems, and expert-level courses.'
        };
        document.getElementById('resultDesc').textContent = descMap[adjustedLevel] || descMap['Average Learner'];
      }
    });

  } // end quiz


  // ══════════════════════════════════════════════════════════
  //  PLAN PAGE
  // ══════════════════════════════════════════════════════════
  var planSections = document.getElementById('planSections');

  if (planSections) {

    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = '../index.html'; return;
    }

    var planName    = localStorage.getItem('planName')         || localStorage.getItem('stuFullName') || 'Student';
    var planCollege = localStorage.getItem('planCollege')      || localStorage.getItem('stuCollege')  || '—';
    var planBranch  = localStorage.getItem('planBranch')       || localStorage.getItem('stuBranch')   || '—';
    var planYear    = localStorage.getItem('planYear')         || localStorage.getItem('stuYear')     || '—';
    var planAvg     = parseInt(localStorage.getItem('planAverage')) || 0;
    var planIQ      = parseInt(localStorage.getItem('planIQ'))      || 0;
    var planLevel   = localStorage.getItem('planLevel')        || 'Average Learner';
    var planWeak    = localStorage.getItem('planWeak')         || '—';
    var marksJSON   = localStorage.getItem('planSubjectMarks') || '{}';
    var subjectMarks = JSON.parse(marksJSON);
    var quizScore   = localStorage.getItem('quizScore') || null;

    var iqSummaryTitle = document.getElementById('iqSummaryTitle');
    var iqSummaryDesc  = document.getElementById('iqSummaryDesc');
    if (iqSummaryTitle) iqSummaryTitle.textContent = 'Estimated IQ: ' + (planIQ || '--');
    if (iqSummaryDesc)  iqSummaryDesc.textContent  =
      'Learning Level: ' + planLevel + '  |  Average: ' + (planAvg || '--') + '/100  |  Weak Subject: ' + planWeak;

    var planLevelBadge = document.getElementById('planLevelBadge');
    if (planLevelBadge) { planLevelBadge.textContent = planLevel; planLevelBadge.className = 'level-badge ' + levelClass(planLevel); }

    setEl('profileName',    planName);
    setEl('profileCollege', planCollege);
    setEl('profileBranch',  planBranch);
    setEl('profileYear',    planYear);
    setEl('profileIQ',      planIQ ? planIQ + ' / 130' : '—');
    setEl('profileWeak',    planWeak);

    var lb = document.getElementById('levelBadge');
    if (lb) { lb.textContent = planLevel; lb.className = 'level-badge ' + levelClass(planLevel); }

    if (quizScore) {
      var qRow = document.getElementById('quizResultRow');
      if (qRow) qRow.style.display = 'flex';
      setEl('profileQuizScore', quizScore + ' (Skill Test)');
    }

    var tbody = document.getElementById('subjectTableBody');
    if (tbody && Object.keys(subjectMarks).length > 0) {
      var minMark = 999; var weakName = '';
      for (var sub in subjectMarks) { if (subjectMarks[sub] < minMark) { minMark = subjectMarks[sub]; weakName = sub; } }
      var html = '';
      for (var sub2 in subjectMarks) {
        if (!subjectMarks.hasOwnProperty(sub2)) continue;
        var m = subjectMarks[sub2];
        html += '<tr' + (sub2 === weakName ? ' class="weak-row"' : '') + '>' +
          '<td>' + sub2 + '</td>' +
          '<td><strong>' + m + '/100</strong></td>' +
          '<td>' + (m < 40 ? '🔴 Weak' : m <= 70 ? '🟡 Moderate' : '🟢 Strong') + '</td>' +
          '</tr>';
      }
      tbody.innerHTML = html;
    }

    var avgBig = document.getElementById('planAvgBig');
    if (avgBig) avgBig.textContent = planAvg ? planAvg + ' / 100' : '—';

    var plan = getPlanContent(planLevel, planBranch);
    planSections.innerHTML =
      buildPlanCard('📅', 'Daily Study Routine',  plan.daily)   +
      buildPlanCard('📋', 'Weekly Study Plan',    plan.weekly)  +
      buildPlanCard('💡', 'Tips & Strategies',    plan.tips)    +
      buildCourseCard(planLevel, planBranch, planWeak);

  } // end plan


  // ══════════════════════════════════════════════════════════
  //  PROFILE PAGE
  // ══════════════════════════════════════════════════════════
  var heroAvatar = document.getElementById('heroAvatar');

  if (heroAvatar) {

    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = '../index.html'; return;
    }

    var pName    = localStorage.getItem('stuFullName') || '—';
    var pCollege = localStorage.getItem('stuCollege')  || '—';
    var pBranch  = localStorage.getItem('stuBranch')   || '—';
    var pYear    = localStorage.getItem('stuYear')     || '—';
    var pIQ      = localStorage.getItem('planIQ')      || null;
    var pLevel   = localStorage.getItem('planLevel')   || null;
    var pAvg     = localStorage.getItem('planAverage') || null;
    var pWeak    = localStorage.getItem('planWeak')    || null;
    var pMarks   = localStorage.getItem('planSubjectMarks') || '{}';
    var pQuiz    = localStorage.getItem('quizScore')   || null;

    // Hero
    heroAvatar.textContent = pName.charAt(0).toUpperCase();
    setEl('heroName', pName);
    setEl('heroSub',  pCollege + ' · ' + pBranch + ' · ' + pYear);

    // Info card
    setEl('profName',    pName);
    setEl('profCollege', pCollege);
    setEl('profBranch',  pBranch);
    setEl('profYear',    pYear);

    // Academic card
    setEl('profIQ',  pIQ   ? pIQ + ' / 130'     : 'Not yet calculated');
    setEl('profAvg', pAvg  ? pAvg + ' / 100'     : 'Not yet calculated');
    setEl('profWeak', pWeak || 'Not yet calculated');

    var profLvlBadge = document.getElementById('profLevelBadge');
    if (profLvlBadge) {
      profLvlBadge.textContent = pLevel || '—';
      profLvlBadge.className   = pLevel ? 'level-badge ' + levelClass(pLevel) : 'level-badge';
    }

    if (pQuiz) {
      var qRowP = document.getElementById('quizRow');
      if (qRowP) qRowP.style.display = 'flex';
      setEl('profQuiz', pQuiz);
    }

    // Subject marks
    var parsedMarks = JSON.parse(pMarks);
    var subjectMarksList = document.getElementById('subjectMarksList');
    var subjectMarksCard = document.getElementById('subjectMarksCard');
    if (subjectMarksList && Object.keys(parsedMarks).length > 0) {
      if (subjectMarksCard) subjectMarksCard.style.display = 'block';
      var html = '';
      for (var sn in parsedMarks) {
        if (!parsedMarks.hasOwnProperty(sn)) continue;
        var mv = parsedMarks[sn];
        var color = mv < 40 ? '#b03030' : mv <= 70 ? '#9a6800' : '#1a7a38';
        html +=
          '<div style="display:flex;align-items:center;justify-content:space-between;' +
            'padding:10px 14px;background:#faf8f4;border:1px solid #eee8df;border-radius:10px;">' +
            '<span style="font-size:13.5px;font-weight:500;color:#1a1510;">' + sn + '</span>' +
            '<span style="font-size:13.5px;font-weight:700;color:' + color + ';">' + mv + ' / 100</span>' +
          '</div>';
      }
      subjectMarksList.innerHTML = html;
    }

    // Progress history
    renderProgressHistory();

  } // end profile


  // ══════════════════════════════════════════════════════════
  //  SETTINGS PAGE
  // ══════════════════════════════════════════════════════════
  var changePassBtn = document.getElementById('changePassBtn');

  if (changePassBtn) {

    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = '../index.html'; return;
    }

    // Fill account details
    setEl('settName',    localStorage.getItem('stuFullName') || '—');
    setEl('settCollege', localStorage.getItem('stuCollege')  || '—');
    setEl('settBranch',  localStorage.getItem('stuBranch')   || '—');
    setEl('settYear',    localStorage.getItem('stuYear')     || '—');

    // Change Password
    changePassBtn.addEventListener('click', function () {
      var currentPass = document.getElementById('currentPass').value.trim();
      var newPass     = document.getElementById('newPass').value.trim();
      var confirmPass = document.getElementById('confirmPass').value.trim();

      if (!currentPass || !newPass || !confirmPass) {
        showToast('⚠️ Please fill in all password fields.'); return;
      }

      var storedPass = localStorage.getItem('stuPassword');
      if (currentPass !== storedPass) {
        showToast('❌ Current password is incorrect.'); return;
      }
      if (newPass !== confirmPass) {
        showToast('❌ New passwords do not match.'); return;
      }
      if (newPass.length < 4) {
        showToast('⚠️ Password must be at least 4 characters.'); return;
      }

      localStorage.setItem('stuPassword', newPass);
      document.getElementById('currentPass').value = '';
      document.getElementById('newPass').value     = '';
      document.getElementById('confirmPass').value = '';
      showToast('✅ Password updated successfully!');
    });

    // Reset Progress
    var resetProgressBtn = document.getElementById('resetProgressBtn');
    if (resetProgressBtn) {
      resetProgressBtn.addEventListener('click', function () {
        var confirmed = confirm('This will clear all your marks, IQ score, quiz result, and progress history.\n\nYour account (name, college, branch, password) will be kept.\n\nAre you sure?');
        if (!confirmed) return;

        var keysToRemove = [
          'planName', 'planCollege', 'planBranch', 'planYear',
          'planSubjectMarks', 'planAverage', 'planIQ', 'planLevel', 'planWeak',
          'quizScore', 'quizLevel', 'progressHistory'
        ];
        for (var i = 0; i < keysToRemove.length; i++) {
          localStorage.removeItem(keysToRemove[i]);
        }
        showToast('✅ Progress has been reset successfully.');
      });
    }

    // Clear History Only
    var clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', function () {
        var confirmed = confirm('This will remove all progress history entries. Your current IQ and marks will be kept.\n\nContinue?');
        if (!confirmed) return;
        localStorage.removeItem('progressHistory');
        showToast('✅ History cleared.');
      });
    }

    // Settings page logout
    var settingsLogoutBtn = document.getElementById('settingsLogoutBtn');
    if (settingsLogoutBtn) {
      settingsLogoutBtn.addEventListener('click', function () {
        localStorage.clear();
        window.location.href = '../index.html';
      });
    }

  } // end settings


  // ══════════════════════════════════════════════════════════
  //  LIVE INSIGHT CARD (dashboard)
  // ══════════════════════════════════════════════════════════
  function updateInsightCard() {
    var inputs = document.querySelectorAll('.grade-input');
    if (!inputs.length) return;

    var total = 0; var filled = 0;
    var subjectMarks = {};

    for (var i = 0; i < inputs.length; i++) {
      var v = parseInt(inputs[i].value);
      if (!isNaN(v) && v >= 0 && v <= 100) {
        total += v; filled++;
        subjectMarks[inputs[i].getAttribute('data-subject')] = v;
      }
    }

    var iqEl   = document.getElementById('insightIQ');
    var lvlEl  = document.getElementById('insightLevel');
    var avgEl  = document.getElementById('insightAvg');
    var weakEl = document.getElementById('insightWeak');
    var rpCourses = document.getElementById('rpCourses');

    if (filled === 0) {
      resetEl(iqEl); resetEl(lvlEl); resetEl(avgEl);
      if (weakEl) { weakEl.textContent = '--'; weakEl.className = 'insight-value weak'; }
      return;
    }

    var avg   = Math.round(total / filled);
    var iq    = Math.round(70 + (avg * 0.6));
    var level = classifyLevel(iq);
    var weak  = findWeakSubject(subjectMarks);

    setLive(avgEl,  avg + ' / 100');
    setLive(iqEl,   iq.toString());
    setLive(lvlEl,  levelEmoji(level) + ' ' + level);
    if (weakEl) { weakEl.textContent = weak; weakEl.className = 'insight-value weak'; }

    // Live course recommendations
    if (rpCourses && filled >= 2) {
      var branch  = localStorage.getItem('stuBranch') || 'CSE';
      var courses = getCourseRecommendations(level, branch, weak);
      var html = '';
      for (var c = 0; c < Math.min(courses.length, 3); c++) {
        html += '<div class="rp-course-item">' +
          '<div class="rp-course-title">' + courses[c].title + '</div>' +
          '<div class="rp-course-platform">' + courses[c].platform + '</div>' +
          '</div>';
      }
      rpCourses.innerHTML = html;
    }
  }


  // ══════════════════════════════════════════════════════════
  //  PROGRESS HISTORY — save + render
  // ══════════════════════════════════════════════════════════

  function getProgressHistory() {
    try { return JSON.parse(localStorage.getItem('progressHistory')) || []; }
    catch (e) { return []; }
  }

  function saveProgressEntry(entry) {
    var history = getProgressHistory();
    // Keep last 20 entries max
    history.push(entry);
    if (history.length > 20) history = history.slice(history.length - 20);
    localStorage.setItem('progressHistory', JSON.stringify(history));
  }

  function renderProgressHistory() {
    var historyList  = document.getElementById('historyList');
    var historyEmpty = document.getElementById('historyEmpty');
    if (!historyList) return;

    var history = getProgressHistory();

    if (history.length === 0) {
      if (historyEmpty) historyEmpty.style.display = 'block';
      return;
    }

    if (historyEmpty) historyEmpty.style.display = 'none';

    // Show newest first
    var reversed = history.slice().reverse();
    var html = '';

    for (var i = 0; i < reversed.length; i++) {
      var h = reversed[i];
      var lvlCls = levelClass(h.level || 'Average Learner');
      html +=
        '<div class="history-item">' +
          '<span class="history-date">' + (h.date || 'Unknown') + '</span>' +
          '<div class="history-stats">' +
            '<span class="history-stat">IQ: ' + (h.iq || '--') + '</span>' +
            '<span class="history-stat">Avg: ' + (h.average || '--') + '/100</span>' +
            '<span class="history-stat" style="color:#b03030;">⚠ ' + (h.weak || '--') + '</span>' +
          '</div>' +
          '<div class="history-level"><span class="level-badge ' + lvlCls + '">' + (h.level || '—') + '</span></div>' +
        '</div>';
    }

    historyList.innerHTML = html;
  }

  function formatDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }


  // ══════════════════════════════════════════════════════════
  //  TOAST NOTIFICATION (Settings page)
  // ══════════════════════════════════════════════════════════
  function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3000);
  }


  // ══════════════════════════════════════════════════════════
  //  HELPER: Subjects by Branch
  // ══════════════════════════════════════════════════════════
  function getSubjectsByBranch(branch) {
    var map = {
      'CSE':   [{ icon:'💻', name:'Programming' }, { icon:'🗂️', name:'Data Structures' }, { icon:'🗄️', name:'DBMS' }, { icon:'🖥️', name:'Operating Systems' }, { icon:'🌐', name:'Computer Networks' }],
      'ECE':   [{ icon:'⚡', name:'Circuits' }, { icon:'📡', name:'Signals & Systems' }, { icon:'🔌', name:'Digital Electronics' }, { icon:'📻', name:'Communication Systems' }, { icon:'🔧', name:'Microprocessors' }],
      'MECH':  [{ icon:'⚙️', name:'Engineering Mechanics' }, { icon:'🌡️', name:'Thermodynamics' }, { icon:'🔩', name:'Strength of Materials' }, { icon:'🏭', name:'Manufacturing Processes' }, { icon:'💨', name:'Fluid Mechanics' }],
      'CIVIL': [{ icon:'🏗️', name:'Structural Analysis' }, { icon:'🌊', name:'Fluid Mechanics' }, { icon:'🏔️', name:'Geotechnical Engineering' }, { icon:'🛣️', name:'Transportation Engineering' }, { icon:'💧', name:'Environmental Engineering' }],
      'EEE':   [{ icon:'⚡', name:'Electrical Circuits' }, { icon:'🔋', name:'Power Systems' }, { icon:'🔌', name:'Electrical Machines' }, { icon:'📐', name:'Control Systems' }, { icon:'💡', name:'Power Electronics' }],
      'IT':    [{ icon:'💻', name:'Programming' }, { icon:'🔐', name:'Cyber Security' }, { icon:'☁️', name:'Cloud Computing' }, { icon:'🗄️', name:'Database Systems' }, { icon:'🌐', name:'Web Technologies' }]
    };
    return map[branch] || map['CSE'];
  }


  // ══════════════════════════════════════════════════════════
  //  HELPER: Quiz Questions by Branch
  // ══════════════════════════════════════════════════════════
  function getQuizQuestions(branch) {
    var banks = {
      'CSE': [
        { question:'What is the time complexity of Binary Search?', options:['O(n)','O(log n)','O(n²)','O(1)'], correct:1 },
        { question:'Which data structure uses LIFO (Last In, First Out)?', options:['Queue','Linked List','Stack','Tree'], correct:2 },
        { question:'What does SQL stand for?', options:['Structured Query Language','Simple Query Language','Sequential Query Logic','Standard Query Library'], correct:0 },
        { question:'Which of the following is NOT an operating system?', options:['Linux','Windows','Oracle','macOS'], correct:2 },
        { question:'What layer of the OSI model handles IP addressing?', options:['Physical','Data Link','Network','Transport'], correct:2 }
      ],
      'ECE': [
        { question:'What is Ohm\'s Law?', options:['V = IR','P = IV','V = P/I','I = V + R'], correct:0 },
        { question:'Which gate outputs 1 only when all inputs are 1?', options:['OR gate','AND gate','NOT gate','XOR gate'], correct:1 },
        { question:'AM stands for?', options:['Analog Modulation','Amplitude Modulation','Automatic Modulation','Audio Mixing'], correct:1 },
        { question:'Fourier Transform converts a signal from?', options:['Time to frequency domain','Frequency to time domain','Analog to digital','Digital to analog'], correct:0 },
        { question:'Function of a flip-flop?', options:['Amplify signals','Store one bit of data','Convert AC to DC','Filter noise'], correct:1 }
      ],
      'MECH': [
        { question:'Newton\'s First Law: an object remains in motion unless acted on by?', options:['Gravity','An external force','Friction','Momentum'], correct:1 },
        { question:'First Law of Thermodynamics is based on?', options:['Conservation of momentum','Conservation of energy','Conservation of mass','Entropy'], correct:1 },
        { question:'Unit of stress?', options:['Newton','Pascal','Joule','Watt'], correct:1 },
        { question:'Manufacturing process using a mould to shape molten metal?', options:['Forging','Welding','Casting','Machining'], correct:2 },
        { question:'Bernoulli\'s equation relates which quantities in fluid flow?', options:['Temperature, pressure, velocity','Pressure, velocity, height','Mass, volume, density','Force, area, viscosity'], correct:1 }
      ],
      'CIVIL': [
        { question:'Which material has high compressive but low tensile strength?', options:['Steel','Concrete','Timber','Aluminium'], correct:1 },
        { question:'Continuity equation represents?', options:['Energy conservation','Momentum conservation','Mass conservation','Pressure conservation'], correct:2 },
        { question:'Bearing capacity of soil refers to?', options:['Soil colour','Ability to support structural loads','Soil moisture','Particle size'], correct:1 },
        { question:'Highway gradient is expressed as?', options:['Degrees only','Percentage or ratio','Metres per second','Km per hour'], correct:1 },
        { question:'BOD in environmental engineering stands for?', options:['Biological Oxygen Demand','Basic Oxygen Deficiency','Bacterial Organic Detection','Basic Organic Decomposition'], correct:0 }
      ],
      'EEE': [
        { question:'KVL states that?', options:['Sum of currents at node is zero','Sum of voltages in closed loop is zero','Power in = Power out','V is proportional to R'], correct:1 },
        { question:'SI unit of electrical power?', options:['Volt','Ampere','Watt','Ohm'], correct:2 },
        { question:'In a transformer, turns ratio determines?', options:['Current only','Voltage ratio','Power output','Frequency'], correct:1 },
        { question:'Negative feedback in a control system is used to?', options:['Increase gain','Reduce stability','Improve stability and accuracy','Increase oscillation'], correct:2 },
        { question:'MOSFET stands for?', options:['Metal Oxide Semiconductor Field Effect Transistor','Micro Oscillating Signal FET','Multi Output Switching Frequency Electronic Transistor','Metal Only Silicon Field Emitter Terminal'], correct:0 }
      ],
      'IT': [
        { question:'Protocol for secure web browsing?', options:['HTTP','FTP','HTTPS','SMTP'], correct:2 },
        { question:'SQL Injection attacks?', options:['Network hardware','Database queries','Browser cookies','Email servers'], correct:1 },
        { question:'IaaS stands for?', options:['Internet as a Service','Infrastructure as a Service','Integration as a Service','Instrument as a Service'], correct:1 },
        { question:'Which is a NoSQL database?', options:['MySQL','PostgreSQL','MongoDB','Oracle'], correct:2 },
        { question:'CSS stands for?', options:['Computer Style Sheets','Cascading Style Sheets','Creative Style Syntax','Coded Style System'], correct:1 }
      ]
    };
    return banks[branch] || banks['CSE'];
  }


  // ══════════════════════════════════════════════════════════
  //  HELPER: Plan content
  // ══════════════════════════════════════════════════════════
  function getPlanContent(level, branch) {
    if (level === 'Slow Learner') {
      return {
        daily: [
          { title:'Study 1–2 Hours Daily', detail:'Use short focused sessions. Study 30 min, rest 10 min. Avoid marathon study sessions.' },
          { title:'Start with the Basics', detail:'Do not skip fundamentals. Re-read the same chapter multiple times until you are comfortable.' },
          { title:'Handwrite Your Notes', detail:'After reading a topic, write the 5 most important points in your own words. This greatly improves memory.' },
          { title:'Revise Before Sleeping', detail:'Spend 10 minutes reviewing your notes every night. Your brain consolidates what you learned during sleep.' }
        ],
        weekly: [
          { title:'Mon–Tue: Learn One Topic', detail:'Read one new topic slowly. Write notes as you go. Do not rush to the next topic.' },
          { title:'Wednesday: Revise', detail:'Go back over Monday and Tuesday\'s content. Re-read notes and highlight the most important parts.' },
          { title:'Thu–Fri: Practice Problems', detail:'Solve 2–3 easy questions per topic. If stuck, re-read before checking the answer.' },
          { title:'Saturday: Full Review', detail:'Review all notes from the week. Redo wrong questions and make a one-page summary.' },
          { title:'Sunday: Rest', detail:'No studying. Your brain needs rest to absorb the week\'s learning.' }
        ],
        tips: [
          { title:'Be Patient with Yourself', detail:'Everyone learns at their own pace. Slow and steady beats rushing — never give up.' },
          { title:'Use Videos and Diagrams', detail:'Watch short YouTube videos (10–15 min) before reading textbooks. Seeing concepts visually makes them much easier.' },
          { title:'Ask Questions Immediately', detail:'If something is not clear, ask your teacher or classmate that same day. Confusion compounds quickly.' },
          { title:'Celebrate Every Win', detail:'Finished a chapter? Solved a question? That is a real achievement. Recognise your progress — it builds confidence.' }
        ]
      };
    } else if (level === 'Average Learner') {
      return {
        daily: [
          { title:'Study 2–3 Hours Daily', detail:'Split sessions: 1 hour in the morning, 1–2 hours in the evening. Keep this routine including weekends.' },
          { title:'Warm-Up Review (15 min)', detail:'Spend the first 15 minutes of each session reviewing yesterday\'s notes before new content.' },
          { title:'Focus on Weak Subjects First', detail:'Tackle your most difficult subject when your energy is highest — usually at the start of a session.' },
          { title:'Evening Practice', detail:'Solve 5–8 practice questions every evening. Focus on question types you previously got wrong.' }
        ],
        weekly: [
          { title:'Mon–Wed: Learn New Content', detail:'Cover 2–3 new topics per day. Read carefully, take notes, and highlight key formulas or definitions.' },
          { title:'Thu–Fri: Practice Questions', detail:'Solve past paper or textbook questions. Aim for one complete question set per subject each day.' },
          { title:'Saturday: Full Revision', detail:'Review the entire week. Rewrite key concepts in your own words and make a one-page summary per subject.' },
          { title:'Sunday: Light Review', detail:'Rest, but spend 20 minutes reading your summary sheets. Optionally watch one short educational video.' }
        ],
        tips: [
          { title:'Target Weak Topics Directly', detail:'List the 2–3 topics where you lose the most marks. Dedicate the first study block each week to those.' },
          { title:'Timed Practice', detail:'Set a 30-minute timer and answer questions without looking at the textbook. This builds exam speed and confidence.' },
          { title:'Solve Past Papers', detail:'Work through 2–3 years of past exam papers. They reveal the exact question patterns examiners use.' },
          { title:'One Subject Deep Per Week', detail:'Pick one subject to go deep on each week. Consistent improvement by rotation beats scattered effort.' }
        ]
      };
    } else {
      return {
        daily: [
          { title:'Study 3–5 Hours Daily', detail:'Two focused blocks with a proper break. Fast learners benefit from intensity and depth, not just duration.' },
          { title:'Cover 2–3 Advanced Topics Per Session', detail:'Go beyond the syllabus. Read reference books, university notes, or watch IIT/MIT lecture videos.' },
          { title:'Timed Problem Solving', detail:'Set a 20-minute timer and solve competitive problems. Track daily score and try to beat it.' },
          { title:'Teach to Reinforce', detail:'After each topic, explain it out loud as if teaching someone else. Teaching exposes hidden gaps in your knowledge.' }
        ],
        weekly: [
          { title:'Mon–Wed: Advanced Topics', detail:'Study complex, high-weightage chapters. Solve proof-based or design-based questions that go beyond the textbook.' },
          { title:'Thursday: Full Mock Test', detail:'Attempt a complete timed mock exam. No breaks, no textbook. Simulate real exam conditions fully.' },
          { title:'Friday: Error Analysis', detail:'Review every single mistake from Thursday\'s mock. Understand the exact reason for each error.' },
          { title:'Saturday: Challenge Problems', detail:'Attempt olympiad-level or competitive problems. Push well beyond your comfort zone.' },
          { title:'Sunday: Plan & Rest', detail:'Review this week\'s progress, set goals for next week, then completely rest in the afternoon.' }
        ],
        tips: [
          { title:'Depth Over Speed', detail:'Fast learners often rush and skim. Ensure you fully understand every concept rather than just recognising it.' },
          { title:'Explore Beyond Textbooks', detail:'Read research papers, technical blogs, and advanced references. Subscribe to academic channels for your branch.' },
          { title:'Help Slower Classmates', detail:'Teaching classmates who struggle is the highest form of mastery. Their questions reveal areas you haven\'t fully grasped.' },
          { title:'Set Competitive Goals', detail:'Aim for GATE, placements at top companies, or research internships. Ambitious goals keep fast learners motivated.' }
        ]
      };
    }
  }


  // ══════════════════════════════════════════════════════════
  //  HELPER: Course Recommendations
  // ══════════════════════════════════════════════════════════
  function getCourseRecommendations(level, branch, weakSubject) {
    var weakCourseMap = {
      'Programming':               { title:'C Programming Zero to Hero',           platform:'YouTube (Apna College)' },
      'Data Structures':           { title:'DSA Complete Course',                  platform:'GeeksforGeeks / Coursera' },
      'DBMS':                      { title:'SQL & Database Design',                platform:'freeCodeCamp / NPTEL' },
      'Operating Systems':         { title:'OS Fundamentals',                      platform:'NPTEL / Gate Smashers' },
      'Computer Networks':         { title:'Networking Basics',                    platform:'Cisco NetAcad (Free)' },
      'Circuits':                  { title:'Circuit Analysis Basics',              platform:'Khan Academy (Free)' },
      'Signals & Systems':         { title:'Signals & Systems Course',             platform:'NPTEL (Free)' },
      'Digital Electronics':       { title:'Digital Logic Design',                 platform:'YouTube (Neso Academy)' },
      'Communication Systems':     { title:'Analog & Digital Communication',       platform:'NPTEL / Coursera' },
      'Microprocessors':           { title:'8085/8086 Microprocessors',            platform:'YouTube (Engineering Funda)' },
      'Engineering Mechanics':     { title:'Engineering Mechanics',                platform:'NPTEL (Free)' },
      'Thermodynamics':            { title:'Engineering Thermodynamics',           platform:'NPTEL / MIT OCW' },
      'Strength of Materials':     { title:'Strength of Materials',               platform:'NPTEL / YouTube' },
      'Manufacturing Processes':   { title:'Manufacturing Technology',             platform:'NPTEL (Free)' },
      'Fluid Mechanics':           { title:'Fluid Mechanics Fundamentals',         platform:'Khan Academy / NPTEL' },
      'Structural Analysis':       { title:'Structural Analysis Basics',           platform:'NPTEL (Free)' },
      'Geotechnical Engineering':  { title:'Soil Mechanics & Geotechnics',         platform:'NPTEL (Free)' },
      'Transportation Engineering':{ title:'Transportation Engineering',           platform:'NPTEL (Free)' },
      'Environmental Engineering': { title:'Environmental Engineering',            platform:'NPTEL / Coursera' },
      'Electrical Circuits':       { title:'Electrical Circuit Analysis',          platform:'Khan Academy / NPTEL' },
      'Power Systems':             { title:'Power Systems Engineering',            platform:'NPTEL (Free)' },
      'Electrical Machines':       { title:'Electrical Machines Course',           platform:'NPTEL / YouTube' },
      'Control Systems':           { title:'Control Systems Engineering',          platform:'NPTEL (Free)' },
      'Power Electronics':         { title:'Power Electronics Basics',             platform:'NPTEL (Free)' },
      'Cyber Security':            { title:'Introduction to Cybersecurity',        platform:'Cisco NetAcad (Free)' },
      'Cloud Computing':           { title:'AWS Cloud Practitioner',               platform:'AWS Free Tier + Coursera' },
      'Database Systems':          { title:'SQL & NoSQL Databases',               platform:'freeCodeCamp / MongoDB Uni' },
      'Web Technologies':          { title:'Full Stack Web Development',           platform:'The Odin Project (Free)' }
    };

    var branchCourses = {
      'CSE':   [{ title:'Data Structures & Algorithms',   platform:'Coursera (Princeton) / LeetCode', icon:'💻' }, { title:'Machine Learning with Python', platform:'Coursera — Andrew Ng', icon:'🤖' }, { title:'System Design Fundamentals', platform:'GitHub — System Design Primer', icon:'🏗️' }, { title:'Competitive Programming', platform:'Codeforces / LeetCode', icon:'🏆' }],
      'ECE':   [{ title:'VLSI Design',                    platform:'NPTEL (Free)', icon:'🔬' }, { title:'Embedded Systems with Arduino', platform:'Coursera / YouTube', icon:'🔧' }, { title:'Digital Signal Processing', platform:'Coursera (EPFL)', icon:'📡' }, { title:'IoT Fundamentals', platform:'Cisco NetAcad (Free)', icon:'🌐' }],
      'MECH':  [{ title:'CAD/CAM with SolidWorks',        platform:'Coursera / YouTube', icon:'🖥️' }, { title:'Finite Element Analysis', platform:'NPTEL (Free)', icon:'📐' }, { title:'Robotics & Automation', platform:'Coursera (UPenn)', icon:'🤖' }, { title:'Product Design Fundamentals', platform:'Coursera / Udemy', icon:'⚙️' }],
      'CIVIL': [{ title:'AutoCAD for Civil Engineers',    platform:'Udemy / YouTube', icon:'📐' }, { title:'STAAD Pro Structural Design', platform:'YouTube / Udemy', icon:'🏗️' }, { title:'GIS and Remote Sensing', platform:'Coursera (UC Davis)', icon:'🗺️' }, { title:'Quantity Estimation & Costing', platform:'NPTEL (Free)', icon:'📊' }],
      'EEE':   [{ title:'MATLAB for Engineers',           platform:'MathWorks Academy (Free)', icon:'📊' }, { title:'Renewable Energy Systems', platform:'Coursera / NPTEL', icon:'🌱' }, { title:'PLC & Industrial Automation', platform:'YouTube / Udemy', icon:'🏭' }, { title:'Power Electronics Applications', platform:'NPTEL (Free)', icon:'⚡' }],
      'IT':    [{ title:'Ethical Hacking & Cybersecurity',platform:'Udemy / TryHackMe (Free)', icon:'🔐' }, { title:'Full Stack Web Development', platform:'The Odin Project (Free)', icon:'🌐' }, { title:'Cloud Computing — AWS', platform:'AWS Free Tier + Coursera', icon:'☁️' }, { title:'Data Science with Python', platform:'Kaggle (Free) / Coursera', icon:'📊' }]
    };

    var results = [];
    if (weakSubject && weakSubject !== '—' && weakCourseMap[weakSubject]) {
      var wc = weakCourseMap[weakSubject];
      results.push({ title:'⚠️ ' + wc.title + ' (Weak Area Fix)', platform:wc.platform, icon:'📌' });
    }
    var base  = branchCourses[branch] || branchCourses['CSE'];
    var limit = level === 'Slow Learner' ? 2 : level === 'Average Learner' ? 3 : 4;
    for (var i = 0; i < Math.min(base.length, limit); i++) { results.push(base[i]); }
    return results;
  }


  // ══════════════════════════════════════════════════════════
  //  HELPERS — Plan card builders
  // ══════════════════════════════════════════════════════════
  function buildPlanCard(icon, title, steps) {
    var stepsHTML = '';
    for (var i = 0; i < steps.length; i++) {
      stepsHTML += '<div class="plan-step"><div class="plan-step-num">' + (i+1) + '</div>' +
        '<div class="plan-step-content"><p class="plan-step-title">' + steps[i].title + '</p>' +
        '<p class="plan-step-detail">' + steps[i].detail + '</p></div></div>';
    }
    return '<div class="plan-card"><div class="plan-card-header"><span class="plan-card-icon">' + icon +
      '</span><h2 class="plan-card-title">' + title + '</h2></div><div class="plan-steps">' + stepsHTML + '</div></div>';
  }

  function buildCourseCard(level, branch, weakSubject) {
    var courses = getCourseRecommendations(level, branch, weakSubject);
    var html = '';
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      html += '<div class="course-item"><div class="course-item-icon">' + (c.icon||'📘') + '</div>' +
        '<div class="course-item-body"><p class="course-item-title">' + c.title + '</p>' +
        '<p class="course-item-platform">' + c.platform + '</p></div></div>';
    }
    return '<div class="plan-card"><div class="plan-card-header"><span class="plan-card-icon">🎓</span>' +
      '<h2 class="plan-card-title">Recommended Courses</h2></div><div class="course-list">' + html + '</div></div>';
  }


  // ══════════════════════════════════════════════════════════
  //  HELPERS — Utility
  // ══════════════════════════════════════════════════════════
  function classifyLevel(iq) {
    if (iq < 95)   return 'Slow Learner';
    if (iq <= 115) return 'Average Learner';
    return 'Fast Learner';
  }

  function adjustLevelByQuiz(score, existingLevel) {
    if (score >= 4) return 'Fast Learner';
    if (score === 3) return 'Average Learner';
    if (score <= 1)  return 'Slow Learner';
    if (existingLevel === 'Fast Learner') return 'Average Learner';
    return existingLevel;
  }

  function findWeakSubject(subjectMarks) {
    var minMark = 999; var weakName = '—';
    for (var subj in subjectMarks) {
      if (subjectMarks.hasOwnProperty(subj) && subjectMarks[subj] < minMark) {
        minMark = subjectMarks[subj]; weakName = subj;
      }
    }
    return weakName;
  }

  function levelClass(level) {
    if (level === 'Slow Learner')    return 'slow';
    if (level === 'Average Learner') return 'average';
    return 'fast';
  }

  function levelEmoji(level) {
    if (level === 'Slow Learner')    return '🔴';
    if (level === 'Average Learner') return '🟡';
    return '🟢';
  }

  function badge(icon, text) {
    return '<span class="sg-badge" style="margin-right:6px;margin-bottom:8px;">' + icon + ' ' + text + '</span>';
  }

  function setEl(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setLive(el, val) {
    if (!el) return;
    el.textContent = val;
    el.className = 'insight-value live';
  }

  function resetEl(el) {
    if (!el) return;
    el.textContent = '--';
    el.className = 'insight-value';
  }

}; // end window.onload