// Flow: boot -> game -> level up -> story.
import './style.css';
import { sprite } from './sprites.js';
import { audio } from './audio.js';
import { store, burst, vibrate, RM } from './ui.js';
import { runGame } from './game.js';
import { initStory } from './story.js';

const $ = (s) => document.querySelector(s);
const show = (id) => document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));

// iOS Safari ignores user-scalable; block pinch + double-tap zoom here instead.
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });

// ---- sound toggle (on by default) ----
const mute = $('#muteBtn');
function renderMute() {
  mute.innerHTML = sprite(audio.on ? 'soundOn' : 'soundOff', 3);
  mute.setAttribute('aria-pressed', String(audio.on));
  mute.setAttribute('aria-label', audio.on ? 'Turn sound off' : 'Turn sound on');
}
mute.onclick = () => { audio.on = !audio.on; renderMute(); audio.blip(); };
renderMute();

// ---- 1. boot ----
$('#bootArt').innerHTML = sprite('rose', 4) + sprite('heart', 6) + sprite('cupcake', 4) + sprite('can', 4);
$('#hudCan').innerHTML = sprite('can', 3);
const fill = $('#bootFill'), pct = $('#bootPct'), bar = $('#bootBar'), lvl = $('#bootLevel');
const t0 = performance.now(), DUR = 3000;
requestAnimationFrame(function step(now) {
  const p = Math.min(1, (now - t0) / DUR);
  const q = Math.floor(p * 20) / 20; // chunky 5% steps
  fill.style.clipPath = `inset(0 ${100 - q * 100}% 0 0)`;
  pct.textContent = Math.round(q * 100) + '%';
  bar.setAttribute('aria-valuenow', Math.round(q * 100));
  if (p > 0.3) lvl.textContent = 'LEVEL 19 ... LOADING LEVEL 20';
  if (p < 1) requestAnimationFrame(step);
  else bootDone();
});

function bootDone() {
  const seen = store.get().done;
  $('#startBtn').hidden = !!seen;
  $('#replayBtn').hidden = $('#skipBtn').hidden = !seen;
  $('#bootActions').hidden = false;
  (seen ? $('#replayBtn') : $('#startBtn')).focus({ preventScroll: true });
}

function unlock() {
  audio.unlock(); // browsers only allow sound after a tap, so this is where it starts
  vibrate(10);
  mute.hidden = false;
}
$('#startBtn').onclick = $('#replayBtn').onclick = () => { unlock(); startGame(); };
$('#skipBtn').onclick = () => { unlock(); goStory(); };

// ---- 2. game ----
function startGame() {
  show('game');
  runGame($('#game'), levelUp);
}

// ---- 3. level up ----
function levelUp() {
  store.set({ done: true });
  const lu = $('#levelup');
  lu.hidden = false;
  $('#counter').classList.add('won');
  audio.jingle();
  audio.applause();
  vibrate([30, 50, 30, 50, 80]);
  lu.querySelector('.flash').animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 550, easing: 'ease-out' });
  const W = lu.clientWidth, H = lu.clientHeight;
  for (let k = 0; k < (RM ? 1 : 3); k++) {
    setTimeout(() => burst(lu, W / 2, H * 0.45, RM ? 16 : 22, { kind: 'confetti', dist: W * 0.4, fall: H * 0.3, dur: 1400 }), k * 260);
  }
  setTimeout(() => {
    goStory();
    setTimeout(() => (lu.hidden = true), 700);
  }, 3000);
}

// ---- 4. story ----
let story;
function goStory() {
  show('story');
  story ||= initStory($('#story'));
  story.begin();
}
