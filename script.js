let loggedInUser = null;
let careerStack = [];

// ---------- BASIC NAV ----------
function showSection(id) {
  document.querySelectorAll('.page').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// ---------- ENTER HUB ----------
function enterHub() {
  document.getElementById('auth-flow').classList.add('hidden');
  document.getElementById('mainNav').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');

  // change background to main page image
  document.body.classList.remove('login-page');
  document.body.classList.add('main-page');

  fetchVideos();
}

function logout() {
  location.reload();
}

// ---------- AUTH ----------
function signup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('signupPhone').value;
  const msg = document.getElementById('signupMsg');

  if (!name || !email || !phone) {
    msg.innerText = "All fields are required!";
    msg.style.color = '#ef4444';
    return;
  }

  fetch("http://127.0.0.1:5000/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, phone })
  })
  .then(res => res.json())
  .then(() => {
    msg.innerText = "Signup Success! Now Login.";
    msg.style.color = '#10b981';
    showSection('login');
  })
  .catch(() => {
    msg.innerText = "Error! Try again.";
    msg.style.color = '#ef4444';
  });
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const phone = document.getElementById('loginPhone').value;
  const msg = document.getElementById('loginMsg');

  if (!email || !phone) {
    msg.innerText = "Email and phone are required!";
    msg.style.color = '#ef4444';
    return;
  }

  fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, phone })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      loggedInUser = data.user;
      document.getElementById("pName").innerText = data.user.name || "";
      document.getElementById("pEmail").innerText = data.user.email;
      document.getElementById("pPhone").innerText = data.user.phone;
      msg.innerText = "Login successful!";
      msg.style.color = '#10b981';
      showSection('profile');
    } else {
      msg.innerText = "Login Failed. Please Signup first.";
      msg.style.color = '#ef4444';
    }
  })
  .catch(() => {
    msg.innerText = "Server error! Try again.";
    msg.style.color = '#ef4444';
  });
}

// ---------- LEARN SECTION ----------
async function fetchVideos() {
  try {
    const res = await fetch("http://127.0.0.1:5000/videos");
    const data = await res.json();
    const list = document.getElementById("videoList");
    list.innerHTML = "";

    data.forEach((v) => {
      const div = document.createElement("div");
      div.className = "video-item";
      div.innerHTML = `
        <p style="font-size:0.8rem;margin-bottom:4px;">${v.name}</p>
        <video controls src="${v.url}"></video>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Load videos if dashboard already visible (optional)
  fetchVideos();

  // Upload handler
  const form = document.getElementById("uploadForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById("videoFile");
      if (!fileInput.files.length) return;

      const formData = new FormData();
      formData.append("video", fileInput.files[0]);

      try {
        await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });
        fileInput.value = "";
        fetchVideos();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Tabs in Study Habits
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // Accordion
  const accBtns = document.querySelectorAll(".acc-btn");
  accBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      panel.classList.toggle("open");
    });
  });
});

// ---------- HABIT DETAILS (WEAKNESSES) ----------
function showHabitDetail(key) {
  const div = document.getElementById("weakness-detail");
  if (!div) return;
  let content = "";

  if (key === "laziness") {
    content = `
      <h3>Laziness</h3>
      <p><strong>What it does:</strong> Laziness makes you postpone even small tasks, which leads to incomplete notes, backlogs and low confidence before exams. Over time you start believing “I am not a serious student”, which hurts your identity.</p>
      <p><strong>Why it happens:</strong> Tasks feel too big or boring, so the brain chooses comfort (mobile, chatting, sleeping) instead of effort. Many students also feel secretly afraid that even if they try, they may still fail, so they avoid starting.</p>
      <p><strong>Daily fixes (5–15 mins):</strong></p>
      <ul>
        <li>Break every chapter into mini-goals like “read 2 pages + 3 questions” instead of “finish unit 1”.</li>
        <li>Use a 10‑minute rule: tell yourself “I will study just 10 minutes”, and after 10 minutes decide if you want to continue.</li>
        <li>Keep your study table ready the previous night with only one book and one notebook.</li>
      </ul>
      <p><strong>Long‑term habit:</strong> Track small wins in a diary or Google Sheet. Every day, write 1–3 things you completed. Seeing progress kills the lazy label in your mind.</p>
    `;
  } else if (key === "procrastination") {
    content = `
      <h3>Procrastination</h3>
      <p><strong>What it does:</strong> Procrastination pushes all work to the last days, so you end up cramming, forgetting faster, and scoring below your actual potential. Stress, guilt and all‑nighters become normal before exams.</p>
      <p><strong>Why it happens:</strong> Fear of failure, perfectionism (“I will start when I can do it perfectly”), or too many simultaneous goals. Your brain avoids the discomfort and chooses easy tasks like scrolling or chatting.</p>
      <p><strong>How to break it:</strong></p>
      <ul>
        <li>Every evening, write only 3 top tasks for tomorrow (not 20). Example: OS – 2 scheduling problems, Java – 1 program, Maths – 10 sums.</li>
        <li>Start with the smallest, least scary step. If you have to do 30 questions, commit to 3 first.</li>
        <li>Remove “all‑or‑nothing” thinking. Even 40–50% completion today is better than 0% perfect plan.</li>
      </ul>
      <p><strong>Bonus tip:</strong> Study with a friend on call: both say your task + time, mute the call, and unmute after 30 minutes to report progress.</p>
    `;
  } else if (key === "distraction") {
    content = `
      <h3>Distractions</h3>
      <p><strong>What it does:</strong> Constant checking of phone, social media and reels breaks deep focus, so even 3 hours of “study” can give output of only 1 hour. Concepts feel half‑understood and questions take double time.</p>
      <p><strong>Why it happens:</strong> Apps are designed to grab attention with notifications and infinite scroll, and your brain gets small dopamine hits each time, making study feel “slow and boring”.</p>
      <p><strong>How to fix environment:</strong></p>
      <ul>
        <li>Keep the phone in another room or at least out of reach while studying. Use “Focus mode” / “Do Not Disturb”.</li>
        <li>Study at a fixed spot where you only do serious work (no reels / games in that place).</li>
        <li>Use website blockers on laptop for distracting sites during study blocks.</li>
      </ul>
      <p><strong>Mindset shift:</strong> Tell yourself “I am training my brain like a muscle”. Every time you resist checking the phone, focus power increases a little.</p>
    `;
  } else if (key === "multitasking") {
    content = `
      <h3>Multitasking</h3>
      <p><strong>What it does:</strong> Trying to study while chatting, watching videos or browsing reduces understanding and memory. You keep re‑reading the same line and still feel blank in tests.</p>
      <p><strong>How to fix:</strong> Commit to “single‑tasking blocks”: during a 25–30 minute block, only one subject and one source (book / PDF / lecture) is allowed on the table or screen. Close other tabs and apps.</p>
      <p>After the block, take a 5‑minute break where you are free to relax, and then start another single‑tasking block.</p>
    `;
  } else if (key === "cramming") {
    content = `
      <h3>Cramming</h3>
      <p><strong>What it does:</strong> Last‑minute cramming creates fake confidence for a few hours but concepts disappear quickly, especially in subjects like maths, physics, and programming.</p>
      <p><strong>Better approach:</strong> Replace all‑night study with spaced revision across the week. Do a quick 10‑minute review of each important chapter 2–3 times before the exam, and solve at least a few previous questions early.</p>
      <p>Write small formula sheets or concept maps and revise them multiple times instead of reading the whole chapter again and again.</p>
    `;
  } else if (key === "noPlan") {
    content = `
      <h3>No Plan</h3>
      <p><strong>What it does:</strong> Studying “anything, anytime” wastes time and leaves important chapters untouched. You realise gaps only in the last week.</p>
      <p><strong>How to fix:</strong> Make a simple weekly timetable with subjects on the left and days on the top. Mark 1–2 topics per subject per day. Keep it realistic so that you can complete at least 80% of it.</p>
      <p>On Sunday, review what you finished, carry forward leftovers, and adjust the plan. Planning itself should take only 10–15 minutes.</p>
    `;
  } else if (key === "perfectionism") {
    content = `
      <h3>Perfectionism</h3>
      <p><strong>What it does:</strong> Perfectionism makes you delay starting because you want the “perfect notes”, “perfect timetable”, or “perfect environment”. Work piles up and anxiety increases.</p>
      <p><strong>How to fix:</strong> Allow yourself to do a rough first version. Rough notes, rough plan, rough attempts are all okay. You can improve later.</p>
      <p>Ask: “What is the smallest imperfect action I can do in the next 15 minutes that moves me forward?” Then do only that.</p>
    `;
  } else if (key === "sleep") {
    content = `
      <h3>Sleep Deprivation</h3>
      <p><strong>What it does:</strong> Short sleep kills focus, memory and mood. You read the same page multiple times and still forget in the exam.</p>
      <p><strong>How to fix:</strong> Aim for 7–8 hours of sleep on most days. Keep a fixed sleep and wake‑up time, avoid heavy food and screens just before bed, and finish intense study at least 30–45 minutes before sleeping.</p>
      <p>Good sleep is not a waste of time; it is when your brain consolidates what you studied.</p>
    `;
  } else if (key === "notes") {
    content = `
      <h3>Poor Notes</h3>
      <p><strong>What it does:</strong> Messy or incomplete notes make revision slow and confusing. You depend completely on textbooks or videos again.</p>
      <p><strong>How to fix:</strong> Write short, organised notes with headings, sub‑points, and examples. Use one colour for main ideas and another for formulas or key words. After class, take 5 minutes to clean up and highlight.</p>
      <p>Before exams, use these notes + question banks instead of re‑watching all lectures from zero.</p>
    `;
  } else if (key === "mindset") {
    content = `
      <h3>Negative Mindset</h3>
      <p><strong>What it does:</strong> Thoughts like “I am dumb”, “I am always late”, or “This subject is impossible” stop you from even trying, and your brain looks for proof to confirm these beliefs.</p>
      <p><strong>How to fix:</strong> Replace fixed statements with growth statements: “I am weak now but I can improve with practice”, “I will focus on progress, not perfection”. Surround yourself with friends or seniors who talk about effort and strategies, not only marks.</p>
      <p>Write 1 small success daily (finished a topic, solved a problem, cleared a doubt) to slowly re‑train your mindset.</p>
    `;
  }

  div.innerHTML = content;
}

// ---------- HABIT DETAILS (STRENGTHS) ----------
function showStrengthDetail(key) {
  const div = document.getElementById("strength-detail");
  if (!div) return;
  let content = "";

  if (key === "time") {
    content = `
      <h3>Time Management</h3>
      <p><strong>Why it matters:</strong> Good time management ensures every subject gets attention and there is enough revision before tests. You feel in control instead of constantly rushing.</p>
      <p><strong>How to build:</strong> Block fixed study slots for core subjects in a weekly timetable. Keep some buffer time for unexpected work or college events so the plan remains realistic.</p>
      <p>Use simple tools: a notebook, Google Calendar or a wall chart. Review the plan every Sunday and adjust based on what actually happened.</p>
    `;
  } else if (key === "consistency") {
    content = `
      <h3>Consistency</h3>
      <p><strong>Why it matters:</strong> Studying a little every day beats random long study marathons because the brain remembers better with spaced repetition. Consistency builds confidence and reduces exam panic.</p>
      <p><strong>How to build:</strong> Decide a minimum daily study time (for example 2 focused hours) and protect that time like an appointment. Even on busy days, do a short review so the chain does not break.</p>
      <p>Track streaks on a calendar or habit‑tracking app. Visual streaks motivate you to keep going.</p>
    `;
  } else if (key === "focus") {
    content = `
      <h3>Deep Focus</h3>
      <p><strong>Why it matters:</strong> Deep focus lets you understand tough concepts once instead of re‑reading many times. It is especially powerful for coding, maths, and problem‑solving.</p>
      <p><strong>How to build:</strong> Study in a quiet place, keep only one book or topic open, and clearly write a goal for each session (for example: “solve 20 OS scheduling problems” or “implement 2 Java programs”).</p>
      <p>If your mind wanders, gently bring it back and note the distraction on a paper to handle later. This trains your attention like a muscle.</p>
    `;
  } else if (key === "active") {
    content = `
      <h3>Active Recall</h3>
      <p><strong>Why it matters:</strong> Active recall and practice testing are proven to improve long‑term memory much more than passive reading. When you force your brain to retrieve information, connections become stronger.</p>
      <p><strong>How to build:</strong> After reading a concept, close the book and write what you remember in your own words. Solve previous questions without looking at solutions first. Teach a topic to a friend or to an imaginary class.</p>
      <p>Keep a small stack of self‑made questions or flashcards and quiz yourself during short breaks.</p>
    `;
  } else if (key === "health") {
    content = `
      <h3>Health Habits</h3>
      <p><strong>Why it matters:</strong> Good sleep, food, and movement keep your brain sharp and reduce exam stress. A healthy body supports long study hours and quick recovery from tiredness.</p>
      <p><strong>How to build:</strong> Aim for 7–8 hours of sleep, light daily movement (walking, stretching, a bit of exercise), and regular meals. Avoid heavy junk food during intense study days to prevent sleepiness.</p>
      <p>Use water, fruits, and short walks as your main “energy boosters” instead of only caffeine.</p>
    `;
  } else if (key === "reflection") {
    content = `
      <h3>Reflection</h3>
      <p><strong>Why it matters:</strong> Weekly reflection helps you see what is working, what is not, and adjust your plan before it is too late. It converts every week into a learning experience.</p>
      <p><strong>How to build:</strong> Once a week, spend 10–15 minutes answering: What did I study? Where did I waste time? Which subject is getting ignored? What one change will I try next week?</p>
      <p>Writing these answers gives clarity and prevents repeating the same mistakes again and again.</p>
    `;
  } else if (key === "pomodoro") {
    content = `
      <h3>Pomodoro Technique</h3>
      <p><strong>Why it matters:</strong> Pomodoro (25 minutes study + 5 minutes break) helps you maintain energy and focus without burning out. It turns big scary tasks into manageable chunks.</p>
      <p><strong>How to use:</strong> Set a timer for 25 minutes and work only on one task. Take a 5‑minute break, then repeat. After 4 cycles, take a longer 15–20 minute break.</p>
      <p>Use this especially for theory reading, note‑making, and revision of long chapters.</p>
    `;
  } else if (key === "mapping") {
    content = `
      <h3>Mind Mapping</h3>
      <p><strong>Why it matters:</strong> Mind maps help you see the full picture of a chapter on one page. This is great for revision of OS, DBMS, and long theory topics.</p>
      <p><strong>How to build:</strong> Write the chapter name in the centre, draw branches for sub‑topics, and add keywords, formulas, and diagrams. Keep the map colourful and simple.</p>
      <p>Before exams, revise mind maps instead of whole chapters to get quick overview plus details.</p>
    `;
  } else if (key === "group") {
    content = `
      <h3>Group Study</h3>
      <p><strong>Why it matters:</strong> Group study, when done correctly, gives quick doubt‑clearing, peer motivation, and exposure to different ways of solving problems.</p>
      <p><strong>How to use safely:</strong> Keep groups small (2–4 serious friends), decide a clear agenda, and avoid turning it into a gossip session. Rotate who explains which topic.</p>
      <p>Online calls with screen‑sharing can also work: solve questions together or explain important derivations.</p>
    `;
  } else if (key === "spaced") {
    content = `
      <h3>Spaced Repetition</h3>
      <p><strong>Why it matters:</strong> Spaced repetition means revising topics multiple times with gaps in between, which is very powerful for formulas, definitions, and concepts you want to remember long‑term.</p>
      <p><strong>How to build:</strong> After first learning, revise the same topic the next day, then after 3–4 days, then after 1–2 weeks. Keep a simple revision calendar or use flashcard apps.</p>
      <p>This technique is perfect for subjects with heavy theory or problem‑solving patterns.</p>
    `;
  }

  div.innerHTML = content;
}

// ---------- CAREER MODAL ----------
const modal = document.getElementById("careerModal");
const modalBody = document.getElementById("careerModalBody");

function openCareerModal(level) {
  careerStack = [];
  modal.style.display = "flex";
  loadCareerLevel(level);
}

function loadCareerLevel(level) {
  careerStack.push(level);
  let html = "";

  if (level === "after10") {
    html = `
      <h3>After 10th – Choose Your Stream</h3>
      <p>After 10th, you typically select a broad stream that shapes your future options.</p>
      <ul>
        <li><strong>MPC (Maths, Physics, Chemistry):</strong> Best for engineering, technology, data and quantitative careers.</li>
        <li><strong>BiPC (Biology, Physics, Chemistry):</strong> Suits medical, pharmacy, agriculture and life sciences.</li>
        <li><strong>Commerce (MEC/CEC):</strong> Leads to finance, business, CA/CS, banking and management roles.</li>
        <li><strong>Arts / Humanities:</strong> Good for law, civil services, design, psychology, media and social sciences.</li>
      </ul>
      <p style="margin-top:6px;">Select a stream to see more details.</p>
      <button onclick="loadCareerLevel('after10_mpc')">MPC</button>
      <button onclick="loadCareerLevel('after10_bipc')">BiPC</button>
      <button onclick="loadCareerLevel('after10_other')">Commerce / Arts</button>
    `;
  } else if (level === "after10_mpc") {
    html = `
      <h3>After 10th → MPC</h3>
      <p>MPC builds strong maths and physics fundamentals, which are needed for engineering, aviation, data science and many modern tech roles.</p>
      <p>After Intermediate MPC, popular choices include B.Tech, B.Sc (Maths/Physics/Data Science), Architecture, Defence (NDA), and aviation courses like pilot training.</p>
    `;
  } else if (level === "after10_bipc") {
    html = `
      <h3>After 10th → BiPC</h3>
      <p>BiPC focuses on biology and prepares you for medical and non‑medical life science careers.</p>
      <p>After 12th BiPC, you can target MBBS, BDS, BAMS, B.Sc Nursing, B.Pharm, B.Sc Agriculture, Biotechnology and many allied health courses.</p>
    `;
  } else if (level === "after10_other") {
    html = `
      <h3>After 10th → Commerce / Arts</h3>
      <p>Commerce streams like MEC/CEC are great if you like accounts, business, and economics and want careers in CA, CMA, CS, banking or corporate finance.</p>
      <p>Arts/Humanities let you explore law, journalism, civil services, design, psychology and social work depending on your interests.</p>
    `;
  } else if (level === "after12") {
    html = `
      <h3>After 12th / Intermediate</h3>
      <p>At this stage you choose specific degrees and entrance exams based on your stream.</p>
      <button onclick="loadCareerLevel('after12_mpc')">For MPC Students</button>
      <button onclick="loadCareerLevel('after12_bipc')">For BiPC Students</button>
      <button onclick="loadCareerLevel('after12_others')">For Commerce / Arts</button>
    `;
  } else if (level === "after12_mpc") {
    html = `
      <h3>After 12th → MPC</h3>
      <ul>
        <li><strong>Engineering (B.Tech/B.E.):</strong> CSE, IT, ECE, EEE, Mechanical, Civil, AI & DS. Enter via JEE, EAMCET and similar exams.</li>
        <li><strong>Pure Sciences:</strong> B.Sc in Maths, Physics, Statistics, Data Science for research or analytics careers.</li>
        <li><strong>Other options:</strong> B.Arch, Defence (NDA), Commercial Pilot, integrated law or management in some universities.</li>
      </ul>
      <p style="margin-top:6px;">If you enjoy problem‑solving and technology, CSE/IT and data‑oriented courses are high‑demand choices.</p>
    `;
  } else if (level === "after12_bipc") {
    html = `
      <h3>After 12th → BiPC</h3>
      <ul>
        <li><strong>Medical:</strong> MBBS, BDS, BAMS, BHMS, BPT, B.Sc Nursing via NEET and other exams.</li>
        <li><strong>Allied health:</strong> B.Pharm, B.Sc Medical Lab Technology, Radiology, Physiotherapy, Nutrition and Dietetics.</li>
        <li><strong>Life sciences:</strong> B.Sc in Biotechnology, Microbiology, Agriculture, Food Technology and Environmental Science.</li>
      </ul>
      <p style="margin-top:6px;">BiPC students also have strong options in allied health and biotechnology fields beyond core MBBS/BDS.</p>
    `;
  } else if (level === "after12_others") {
    html = `
      <h3>After 12th → Commerce / Arts</h3>
      <ul>
        <li><strong>Commerce:</strong> B.Com (General/Computers), BBA, BBM plus professional routes like CA, CMA, CS.</li>
        <li><strong>Management & Law:</strong> Integrated BBA LL.B/BA LL.B, hotel management, event management, entrepreneurship.</li>
        <li><strong>Arts:</strong> BA in Economics, Political Science, Psychology, Journalism, Sociology with options for UPSC and other govt exams later.</li>
      </ul>
    `;
  } else if (level === "afterDegree") {
    html = `
      <h3>After Degree / B.Tech / MBBS</h3>
      <p>After graduation you can go for higher studies, research or enter the job market directly.</p>
      <button onclick="loadCareerLevel('afterDegree_pg')">Post‑Graduation (PG)</button>
      <button onclick="loadCareerLevel('afterDegree_phd')">Ph.D / Research</button>
      <button onclick="loadCareerLevel('afterDegree_jobs')">Jobs / Competitive Exams</button>
    `;
  } else if (level === "afterDegree_pg") {
    html = `
      <h3>After Degree → PG</h3>
      <ul>
        <li><strong>Engineering:</strong> M.Tech / MS in specialized areas such as AI, Machine Learning, VLSI, Power Systems, Cyber Security.</li>
        <li><strong>Management:</strong> MBA in domains like Finance, Marketing, Operations, Business Analytics.</li>
        <li><strong>Medical & Life Sciences:</strong> MD/MS, MDS, M.Pharm, M.Sc (Biotech, Microbiology, Public Health) for deeper specialization.</li>
      </ul>
    `;
  } else if (level === "afterDegree_phd") {
    html = `
      <h3>After Degree → Ph.D / Research</h3>
      <p>Ph.D is suitable if you like discovering new knowledge, publishing papers and teaching in universities.</p>
      <p>Usually you complete a good PG degree, clear national-level tests in your field, and then join research programs in India or abroad.</p>
    `;
  } else if (level === "afterDegree_jobs") {
    html = `
      <h3>After Degree → Jobs / Exams</h3>
      <ul>
        <li><strong>Campus & private jobs:</strong> IT services, product companies, core engineering roles, hospitals, labs, NGOs, startups.</li>
        <li><strong>Government & PSUs:</strong> UPSC, State PSC, SSC, banking exams, PSU recruitments, defence services.</li>
        <li><strong>Skill focus:</strong> Build strong projects, internships, coding practice, communication skills and domain knowledge to stand out.</li>
      </ul>
    `;
  }

  modalBody.innerHTML = html;
}

function closeCareerModal() {
  modal.style.display = "none";
}

function careerBack() {
  if (careerStack.length <= 1) {
    closeCareerModal();
    return;
  }
  careerStack.pop();
  const prev = careerStack.pop();
  loadCareerLevel(prev);
}

window.onclick = function (event) {
  if (event.target === modal) {
    closeCareerModal();
  }
};
