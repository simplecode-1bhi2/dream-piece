/* ===============================
   🚀 MAIN INITIALIZATION
=============================== */
document.addEventListener("DOMContentLoaded", initApp);

// Clear broken functions or leftover values safely
window.setCustomDuration = function() {}; // no-op to prevent errors


function initApp() {
  document.body.classList.add("loaded");

  loadCgpa();
  loadHabits();
  calculateDaysUntilExam();
  showDailyQuote();
  updateTimerDisplay();
  updateSessionDisplay();
  applySavedTheme();
  setupCgpaListeners(); // ✅ ensures CGPA works on both mobile and desktop



  // ✅ Event Listeners
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  const examInput = document.getElementById("examDate");
  if (examInput) {
    examInput.addEventListener("change", handleExamChange);
    examInput.addEventListener("keydown", handleExamKey);
  }
}

/* ===============================
   ⏳ Focus Timer with Techniques
=============================== */
let timer;
let duration = 60 * 60;
let timeLeft = duration;
let running = false;
let completedSessions = parseInt(localStorage.getItem("sessions")) || 0;
let mode = "normal";
let isBreak = false;


function toggleZenSound(enable) {
  if (enable) bgAudio.play();
  else bgAudio.pause();
}

/* ⚙️ Mode Selector */
const focusSelect = document.getElementById("focusMode");
if (focusSelect) {
  focusSelect.addEventListener("change", () => {
    mode = focusSelect.value;
    switch (mode) {
      case "pomodoro":
        duration = 25 * 60;
        showAchievement("🍅 Pomodoro Mode — 25 min Focus!");
        toggleZenSound(false);
        break;
      case "flow":
        duration = 90 * 60;
        showAchievement("💧 Flow Mode — 90 min Deep Focus!");
        toggleZenSound(false);
        break;
      case "sprint":
        duration = 45 * 60;
        showAchievement("⚡ Sprint Focus — 45 min burst!");
        toggleZenSound(false);
        break;
      case "zen":
        duration = 60 * 60;
        showAchievement("🌙 Zen Mode — Stay calm & focused.");
        toggleZenSound(true);
        break;
      case "extreme":
        duration = 120 * 60;
        showAchievement("🔥 Extreme Mode — 2 hours, full throttle!");
        toggleZenSound(false);
        break;
      default:
        duration = 60 * 60;
        showAchievement("⏰ Normal Focus Mode Active");
        toggleZenSound(false);
    }
    timeLeft = duration;
    updateTimerDisplay();
  });
}

/* 🕒 Change Duration Manually (only normal mode) */
function changeDuration() {
  if (mode !== "normal") return;
  const select = document.getElementById("timerDuration");
  duration = parseInt(select.value) * 60;
  timeLeft = duration;
  updateTimerDisplay();
}

/* ▶️ Start Timer */
function startTimer() {
  if (running) return;
  running = true;

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      running = false;

      if (mode === "pomodoro") {
        if (!isBreak) {
          showAchievement("✅ Pomodoro done! 5 min break ☕");
          isBreak = true;
          duration = 5 * 60;
        } else {
          showAchievement("🍅 Break over! Back to focus.");
          isBreak = false;
          duration = 25 * 60;
          completedSessions++;
        }
        localStorage.setItem("sessions", completedSessions);
        updateSessionDisplay();
        timeLeft = duration;
        setTimeout(startTimer, 2000);
      } else {
        completedSessions++;
        localStorage.setItem("sessions", completedSessions);
        updateSessionDisplay();
        showAchievement(`🔥 You’ve completed ${completedSessions} focus session${completedSessions > 1 ? "s" : ""}!`);
        alert("⏰ Time's up! Take a short break ☕");
      }
    }
  }, 1000);
}

/* ⏹️ Reset */
function resetTimer() {
  clearInterval(timer);
  running = false;
  isBreak = false;
  timeLeft = duration;
  updateTimerDisplay();
  toggleZenSound(false);
}

/* ⏸️ Pause / Resume */
function pauseTimer() {
  if (!running) return; // can't pause if not running

  clearInterval(timer);
  running = false;

  const pauseBtn = document.querySelector('button[onclick="pauseTimer()"]');
  if (pauseBtn) {
    pauseBtn.textContent = "▶️ Resume";
    pauseBtn.setAttribute("onclick", "resumeTimer()");
  }
}

function resumeTimer() {
  if (running) return; // already running
  running = true;

  const pauseBtn = document.querySelector('button[onclick="resumeTimer()"]');
  if (pauseBtn) {
    pauseBtn.textContent = "⏸️ Pause";
    pauseBtn.setAttribute("onclick", "pauseTimer()");
  }

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      running = false;
      completedSessions++;
      localStorage.setItem("sessions", completedSessions);
      updateSessionDisplay();
      showAchievement("🔥 Focus session complete!");
      alert("⏰ Time's up!");
    }
  }, 1000);
}


/* 🧮 Display Update */
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const el = document.getElementById("timerDisplay");
  if (el) el.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/* ✨ Achievement Popup */
function showAchievement(msg) {
  const popup = document.createElement("div");
  popup.textContent = msg;
  Object.assign(popup.style, {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    padding: "15px 25px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    fontWeight: "600",
    opacity: "0",
    transition: "opacity 0.5s, transform 0.5s",
    zIndex: "9999"
  });
  document.body.appendChild(popup);
  setTimeout(() => (popup.style.opacity = "1"), 50);
  setTimeout(() => popup.remove(), 2500);
}


function updateSessionDisplay() {
  const el = document.getElementById("sessionCount");
  if (el) el.textContent = `🎯 Sessions Completed: ${completedSessions}`;
}

function showAchievement(msg) {
  const popup = document.createElement("div");
  popup.textContent = msg;
  Object.assign(popup.style, {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    padding: "15px 25px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    fontWeight: "600",
    opacity: "0",
    transition: "opacity 0.5s, transform 0.5s",
    zIndex: "9999"
  });
  document.body.appendChild(popup);
  setTimeout(() => (popup.style.opacity = "1"), 50);
  setTimeout(() => popup.remove(), 2500);
}

/* ===============================
   🌙 Dark Mode
=============================== */
function applySavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    const btn = document.getElementById("themeToggle");
    if (btn) btn.textContent = "☀️ Light Mode";
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

/* ===============================
   🎓 CGPA Tracker (Fixed Version)
=============================== */
/* ===============================
   🎓 CGPA — Mobile + Desktop Compatible
=============================== */
function loadCgpa() {
  const current = parseFloat(localStorage.getItem("currentCgpa")) || 5.9;
  const target = parseFloat(localStorage.getItem("targetCgpa")) || 8.5;

  document.getElementById("currentCgpaDisplay").textContent = formatCgpa(current);
  document.getElementById("targetCgpaDisplay").textContent = formatCgpa(target);
}

/* 🔄 Works for Enter key (desktop) and blur/change (mobile) */
function setupCgpaListeners() {
  const currentInput = document.getElementById("currentCgpaInput");
  const targetInput = document.getElementById("targetCgpaInput");

  ["keydown", "change", "blur"].forEach(evt => {
    currentInput.addEventListener(evt, e => {
      if (e.type === "keydown" && e.key !== "Enter") return;
      saveCgpa("current");
    });

    targetInput.addEventListener(evt, e => {
      if (e.type === "keydown" && e.key !== "Enter") return;
      saveCgpa("target");
    });
  });
}

function saveCgpa(type) {
  const input = document.getElementById(`${type}CgpaInput`);
  const value = parseFloat(input.value.trim());
  if (isNaN(value) || value < 0 || value > 10) {
  input.style.borderColor = "#ef4444";
  setTimeout(() => input.style.borderColor = "", 1000);
  return;
}


  // Save & display formatted CGPA
  localStorage.setItem(`${type}Cgpa`, value);
  document.getElementById(`${type}CgpaDisplay`).textContent = formatCgpa(value);

  // Visual feedback animation
  const el = document.getElementById(`${type}CgpaDisplay`);
  el.style.transition = "transform 0.3s ease, color 0.3s ease";
  el.style.transform = "scale(1.2)";
  el.style.color = "#667eea";
  setTimeout(() => {
    el.style.transform = "scale(1)";
    el.style.color = "";
  }, 300);

  input.value = "";
}

function formatCgpa(num) {
  const formatted = parseFloat(num.toFixed(1));
  return Number.isInteger(formatted) ? formatted.toString() : formatted;
}

// /* ✅ Run once after DOM loads */
// document.addEventListener("DOMContentLoaded", setupCgpaListeners);



/* ===============================
   📅 Exam Date
=============================== */
function handleExamChange() {
  const value = document.getElementById("examDate").value;
  if (value) {
    localStorage.setItem("examDate", value);
    calculateDaysUntilExam();
  }
}

function handleExamKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleExamChange();
  }
}

function calculateDaysUntilExam() {
  const el = document.getElementById("daysUntilExam");
  const stored = localStorage.getItem("examDate");
  if (!stored) return (el.textContent = "0");
  const examDate = new Date(stored);
  const today = new Date();
  examDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = examDate - today;
  el.textContent = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/* ===============================
   🌅 Quotes
=============================== */
const quotes = [
  "“If you don’t take risks, you can’t create a future.” — Monkey D. Luffy 🏴‍☠️",
  "“When you give up, your dreams and everything else—they're gone.” — Luffy 🌊",
  "“It’s not about being better than someone else, it’s about being better than you were yesterday.” — Goku 💫",
];

function showDailyQuote() {
  const el = document.querySelector(".quote-section");
  if (!el) return;
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  el.textContent = random;
}

/* ===============================
   ✅ Habit Tracker
=============================== */
let habits = [];
const defaultHabits = [
  { name: "📚 Study Coding 1 hour", category: "Coding", completed: false, date: new Date().toISOString() },
  { name: "🗣️ Speak English 15 min", category: "English", completed: false, date: new Date().toISOString() },
  { name: "🏋️ Exercise 20 min", category: "Health", completed: false, date: new Date().toISOString() }
];

function loadHabits() {
  try {
    const stored = JSON.parse(localStorage.getItem("habits"));
    if (!Array.isArray(stored) || stored.length === 0) {
      habits = [...defaultHabits];
      saveData();
    } else {
      habits = stored;
    }
  } catch (e) {
    habits = [...defaultHabits];
    saveData();
  }
  renderHabits();
}


function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
  const list = document.getElementById("habitsList");
  if (!list) return;
  list.innerHTML = "";

  habits.forEach((habit, index) => {
    const div = document.createElement("div");
    div.className = "habit-item" + (habit.completed ? " completed" : "");
    div.innerHTML = `
      <input type="checkbox" class="habit-checkbox" ${habit.completed ? "checked" : ""} onchange="toggleHabit(${index})">
      <div class="habit-details">
          <div class="habit-name">${habit.name}</div>
          <div class="habit-meta"><span class="habit-category">${habit.category}</span></div>
      </div>
      <button class="habit-delete" onclick="deleteHabit(${index})">🗑️</button>`;
    list.appendChild(div);
  });

  updateStats();
}

function addHabit() {
  const name = document.getElementById("habitName").value.trim();
  const category = document.getElementById("habitCategory").value;
  if (name === "") return alert("Enter habit name");

  habits.push({ name, category, completed: false, date: new Date().toISOString() });
  saveData();
  renderHabits();
  document.getElementById("habitName").value = "";
}

function toggleHabit(index) {
  habits[index].completed = !habits[index].completed;
  habits[index].date = new Date().toISOString();
  saveData();
  renderHabits();
}

function deleteHabit(index) {
  habits.splice(index, 1);
  saveData();
  renderHabits();
}

function resetAllHabits() {
  habits = habits.map(h => ({ ...h, completed: false, date: new Date().toISOString() }));
  saveData();
  renderHabits();
}

function updateStats() {
  const today = new Date().toLocaleDateString();
  const todayCompleted = habits.filter(h => h.completed && new Date(h.date).toLocaleDateString() === today).length;
  document.getElementById("todayHabits").textContent = todayCompleted;
  document.getElementById("currentStreak").textContent = todayCompleted > 0 ? 1 : 0;
}

/* ===============================
   🧭 Tab Switching Logic
=============================== */
/* ===============================
   🧭 Tab Switching Logic (Updated for Game)
=============================== */
function switchTab(tabName) {
  // Hide all content sections
  document.querySelectorAll(".content-section").forEach(sec => {
    sec.style.display = "none";
    sec.classList.remove("active");
  });

  // Remove active state from all buttons
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  // Show the selected section
  const selectedSection = document.getElementById(tabName);
  if (selectedSection) {
    selectedSection.style.display = "block";
    selectedSection.classList.add("active");
  }

  // Highlight the clicked button
  const clickedButton = Array.from(document.querySelectorAll(".tab-btn")).find(btn =>
    btn.getAttribute("onclick") === `switchTab('${tabName}')`
  );
  if (clickedButton) clickedButton.classList.add("active");

  // 💡 Hide Focus Timer only on Game Tab
  const focusTimer = document.getElementById("focus-timer");
  if (focusTimer) {
    if (tabName === "game") {
      focusTimer.style.display = "none";
    } else {
      focusTimer.style.display = "block";
    }
  }

  // Save last opened tab
  localStorage.setItem("lastTab", tabName);
}

/* ===============================
   🎮 Rock Paper Scissors Game Logic
=============================== */
const score = JSON.parse(localStorage.getItem('score')) || { wins: 0, losses: 0, ties: 0 };

updateScoreElement();

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === 'scissors') {
    if (computerMove === 'rock') result = 'You lose.';
    else if (computerMove === 'paper') result = 'You win.';
    else result = 'Tie.';
  } else if (playerMove === 'paper') {
    if (computerMove === 'rock') result = 'You win.';
    else if (computerMove === 'paper') result = 'Tie.';
    else result = 'You lose.';
  } else if (playerMove === 'rock') {
    if (computerMove === 'rock') result = 'Tie.';
    else if (computerMove === 'paper') result = 'You lose.';
    else result = 'You win.';
  }

  if (result === 'You win.') score.wins++;
  else if (result === 'You lose.') score.losses++;
  else score.ties++;

  localStorage.setItem('score', JSON.stringify(score));

  document.querySelector('.js-result').innerHTML = result;
  document.querySelector('.js-moves').innerHTML = `
    You <img src="../images/${playerMove}-emoji.png" class="move-icon">
    <img src="../images/${computerMove}-emoji.png" class="move-icon"> Computer
  `;

  updateScoreElement();
}

function updateScoreElement() {
  const el = document.querySelector('.js-score');
  if (el) el.innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickComputerMove() {
  const randomNumber = Math.random();
  if (randomNumber < 1/3) return 'rock';
  else if (randomNumber < 2/3) return 'paper';
  else return 'scissors';
}

function removingScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem('score');
  updateScoreElement();
}
