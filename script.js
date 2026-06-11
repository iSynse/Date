/* ═══════════════════════════════════════════════════════════
   🌸 A SPECIAL QUESTION — script.js
   ═══════════════════════════════════════════════════════════

   ▸ HOW TO SET UP YOUR WEBHOOK (Discord — easiest option)
   ──────────────────────────────────────────────────────────
   1. Open your Discord server ▸ Edit any channel ▸ Integrations ▸ Webhooks ▸ New Webhook
   2. Copy the Webhook URL
   3. Paste it into the WEBHOOK_URL constant below
   4. Done — you'll get a DM-style message in that channel
      the moment she clicks "Submit" 💌

   ▸ ALTERNATIVE: Formspree (email delivery)
   ──────────────────────────────────────────────────────────
   1. Go to https://formspree.io/ and create a free account
   2. Create a new form → copy your form endpoint URL
      (looks like https://formspree.io/f/xxxxxxxx)
   3. Replace the WEBHOOK_URL value AND set USE_FORMSPREE = true
   ═══════════════════════════════════════════════════════════ */

const WEBHOOK_URL   = 'YOUR_DISCORD_WEBHOOK_URL_HERE';  // ← paste here
const USE_FORMSPREE = false;                             // ← set true if using Formspree

/* ─────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────── */
const state = {
  date:  '',
  time:  '',
  foods: [],
  other: ''
};

/* ─────────────────────────────────────────────────────────
   DOM REFS
───────────────────────────────────────────────────────── */
const steps = {
  1: document.getElementById('step1'),
  2: document.getElementById('step2'),
  3: document.getElementById('step3'),
  4: document.getElementById('step4'),
};

let currentStep = 1;

/* ─────────────────────────────────────────────────────────
   BACKGROUND MUSIC CONTROLS
───────────────────────────────────────────────────────── */
const bgAudio     = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

function setMusicActive(isActive) {
  if (!musicToggle) return;
  musicToggle.classList.toggle('active', isActive);
  musicToggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
}

async function startBackgroundMusic() {
  if (!bgAudio) return;
  bgAudio.loop = true;
  try {
    await bgAudio.play();
    setMusicActive(true);
  } catch (err) {
    console.warn('Background music could not start:', err);
  }
}

function toggleMusic() {
  if (!bgAudio) return;
  if (bgAudio.paused) {
    bgAudio.play().then(() => setMusicActive(true)).catch(() => {});
  } else {
    bgAudio.pause();
    setMusicActive(false);
  }
}

if (musicToggle) {
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

/* ─────────────────────────────────────────────────────────
   FLOATING HEARTS BACKGROUND
───────────────────────────────────────────────────────── */
(function spawnFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const emojis = ['💖', '💕', '💘', '💗', '💓', '🌸', '✨'];

  function spawnOne() {
    const el = document.createElement('span');
    el.className = 'fh';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left    = Math.random() * 100 + 'vw';
    el.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';
    const dur = 7 + Math.random() * 10;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = Math.random() * 4 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 5) * 1000);
  }

  for (let i = 0; i < 14; i++) spawnOne();
  setInterval(spawnOne, 900);
})();

/* ─────────────────────────────────────────────────────────
   STEP TRANSITIONS
───────────────────────────────────────────────────────── */
function goToStep(n) {
  const prev = steps[currentStep];
  const next = steps[n];

  prev.classList.add('exit');
  prev.classList.remove('active');

  setTimeout(() => {
    prev.classList.remove('exit');
  }, 520);

  setTimeout(() => {
    next.classList.add('active');
    currentStep = n;
  }, 260);
}

/* ─────────────────────────────────────────────────────────
   STEP 1 — ENVELOPE INTERACTION
───────────────────────────────────────────────────────── */
const envelope     = document.getElementById('envelope');
const envelopeFlap = document.getElementById('envelopeFlap');
const waxSeal      = document.querySelector('.wax-seal');
const letter       = document.getElementById('letter');

let envelopeOpened = false;

envelope.addEventListener('click', () => {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // Start background music on first user interaction (click)
  // This ensures browser autoplay policies allow playback.
  if (typeof startBackgroundMusic === 'function') startBackgroundMusic();

  // 1. Bounce the envelope
  envelope.style.transition = 'transform 0.25s ease';
  envelope.style.transform  = 'scale(1.06)';
  setTimeout(() => { envelope.style.transform = 'scale(1)'; }, 250);

  // 2. Flap opens (CSS rotateX)
  setTimeout(() => {
    waxSeal.classList.add('hide');
    envelopeFlap.classList.add('open');
  }, 200);

  // 3. Letter slides up
  setTimeout(() => {
    letter.classList.add('revealed');
  }, 650);
});

/* No button — runs away on hover */
const noBtn = document.getElementById('noBtn');

function repositionNoBtn() {
  const margin = 80;
  const maxX = window.innerWidth  - noBtn.offsetWidth  - margin;
  const maxY = window.innerHeight - noBtn.offsetHeight - margin;
  const x = Math.floor(Math.random() * maxX) + margin / 2;
  const y = Math.floor(Math.random() * maxY) + margin / 2;
  noBtn.style.left = x + 'px';
  noBtn.style.top  = y + 'px';
}

// Place it sensibly at first: keep No hidden until reveal (it stays inside the letter DOM so it sits next to Yes)
window.addEventListener('load', () => {
  if (noBtn) {
    noBtn.style.display = 'none';
    // clear any teleporting state
    noBtn.classList.remove('teleporting');
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
  }

  // When the letter is revealed, show both buttons inline and shrink Yes so No fits
  if (letter) {
    const mo = new MutationObserver(() => {
      if (letter.classList.contains('revealed')) {
        const yesBtn = document.getElementById('yesBtn');
        if (noBtn) {
          noBtn.style.display = 'inline-block';
        }
        if (yesBtn) {
          yesBtn.classList.add('shrink');
        }
      }
    });
    mo.observe(letter, { attributes: true, attributeFilter: ['class'] });
  }

  // Teleport behavior: switch to fixed positioning on first hover, then teleport on each hover
  let teleporting = false;
  let hoverCount = 0;
  const yesBtnRef = document.getElementById('yesBtn');

  function handleNoHover(e) {
    e.stopPropagation();
    hoverCount++;
    // grow Yes cumulatively
    if (yesBtnRef) {
      const scale = 1 + Math.min(hoverCount * 0.06, 1.6); // cap scale
      yesBtnRef.style.transform = `scale(${scale})`;
    }

    if (!teleporting) {
      // switch No into fixed positioning at current screen coords, then teleport
      const rect = noBtn.getBoundingClientRect();
      noBtn.classList.add('teleporting');
      noBtn.style.position = 'fixed';
      noBtn.style.left = rect.left + 'px';
      noBtn.style.top = rect.top + 'px';
      teleporting = true;
      // small delay to allow layout, then teleport
      setTimeout(() => repositionNoBtn(), 40);
    } else {
      repositionNoBtn();
    }
  }

  if (noBtn) {
    noBtn.addEventListener('mouseenter', handleNoHover);
    noBtn.addEventListener('focus', handleNoHover);
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleNoHover(e); }, { passive: false });
    noBtn.addEventListener('click', (e) => e.preventDefault());
  }
});
// (old continuous runaway logic removed)

/* Yes button */
document.getElementById('yesBtn').addEventListener('click', () => {
  noBtn.style.display = 'none';
  goToStep(2);
});

/* ─────────────────────────────────────────────────────────
   STEP 2 — DATE & TIME
───────────────────────────────────────────────────────── */
document.getElementById('nextBtn').addEventListener('click', () => {
  const d = document.getElementById('dateInput').value;
  const t = document.getElementById('timeInput').value;

  if (!d || !t) {
    shakeMissing(d ? null : 'dateInput', t ? null : 'timeInput');
    return;
  }

  state.date = formatDate(d);
  state.time = formatTime(t);
  goToStep(3);
});

function formatDate(iso) {
  // "2025-08-15" → "August 15, 2025"
  const [y, m, day] = iso.split('-');
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${months[+m - 1]} ${+day}, ${y}`;
}

function formatTime(raw) {
  // "19:30" → "7:30 PM"
  const [h, min] = raw.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(min).padStart(2,'0')} ${period}`;
}

function shakeMissing(...ids) {
  ids.filter(Boolean).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#ff3d7f';
    el.animate([
      { transform: 'translateX(0)'   },
      { transform: 'translateX(-6px)'},
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)'},
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)'   },
    ], { duration: 400, easing: 'ease-in-out' });
    setTimeout(() => { el.style.borderColor = ''; }, 1200);
  });
}

/* ─────────────────────────────────────────────────────────
   STEP 3 — FOOD SELECTION
───────────────────────────────────────────────────────── */
const otherCard      = document.getElementById('otherCard');
const otherInputWrap = document.getElementById('otherInputWrap');
const otherInput     = document.getElementById('otherInput');

document.querySelectorAll('.food-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');

    if (card === otherCard) {
      const isOpen = card.classList.contains('selected');
      otherInputWrap.classList.toggle('open', isOpen);
      if (isOpen) setTimeout(() => otherInput.focus(), 350);
    }
  });
});

document.getElementById('submitBtn').addEventListener('click', () => {
  const selected = [...document.querySelectorAll('.food-card.selected')]
    .map(c => {
      if (c === otherCard && otherInput.value.trim()) {
        return 'Other: ' + otherInput.value.trim();
      }
      return c.dataset.food;
    });

  if (!selected.length) {
    const grid = document.querySelector('.food-grid');
    grid.animate([
      { transform: 'translateX(0)'   },
      { transform: 'translateX(-6px)'},
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)'   },
    ], { duration: 400 });
    return;
  }

  state.foods = selected;
  sendData(state);
  showSuccess(state);
  goToStep(4);
});

/* ─────────────────────────────────────────────────────────
   STEP 4 — SUCCESS
───────────────────────────────────────────────────────── */
function showSuccess({ date, time, foods }) {
  const el = document.getElementById('successDetails');
  el.innerHTML = `
    <div>📅 <strong>Date:</strong> ${date}</div>
    <div>⏰ <strong>Time:</strong> ${time}</div>
    <div>🍽️ <strong>Food:</strong> ${foods.join(', ')}</div>
  `;
  setTimeout(launchConfetti, 500);
}

function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  const emojis = ['💖','💕','💘','💗','🌸','✨','🎀','💝'];
  const count = 60;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-heart';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.fontSize = (0.9 + Math.random() * 1.4) + 'rem';
    const dur  = 2.5 + Math.random() * 3;
    const del  = Math.random() * 2.5;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = del + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + del + 1) * 1000);
  }
}

/* ─────────────────────────────────────────────────────────
   WEBHOOK / FORMSPREE SUBMISSION
───────────────────────────────────────────────────────── */
// ─────────────────────────────────────────────────────────────
// OPTION 1: Google Sheets via SheetDB
// Paste your SheetDB API URL below
// ─────────────────────────────────────────────────────────────
const SHEETDB_URL = 'https://sheetdb.io/api/v1/8xph8fcwwtdak'; // ← paste here

async function sendData({ date, time, foods }) {
  try {
    const response = await fetch(SHEETDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            Date:           date,
            Time:           time,
            Food:           foods.join(', '),
            'Submitted At': new Date().toLocaleString()
          }
        ]
      })
    });

    if (!response.ok) throw new Error('SheetDB error: ' + response.status);
    console.info('💌 Saved to Google Sheets!');
  } catch (err) {
    console.error('Could not save data:', err);
  }
}