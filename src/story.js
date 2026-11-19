// Screen 4: floating photos + typewriter letter + finale.
import C from '../config.js';
import { sprite } from './sprites.js';
import { audio } from './audio.js';
import { openModal, esc, burst, RM } from './ui.js';
import { initExtras } from './extras.js';

const $ = (s, r = document) => r.querySelector(s);
const placeholder = (i, px = 3) => `<div class="ph">${sprite('rose', px)}<span>PHOTO ${i + 1}</span></div>`;
const TILTS = [-6, 4, -3, 7, 5, -5, 3, -7];

export function initStory(root) {
  // ---- photos ----
  const photos = C.photos.slice(0, 8);
  const half = Math.ceil(photos.length / 2);
  const buttons = photos.map((p, i) => {
    const b = document.createElement('button');
    b.className = 'polaroid';
    b.setAttribute('aria-label', `Open photo: ${p.caption}`);
    b.style.cssText = `--r:${TILTS[i]}deg;--dur:${5 + (i % 3) * 0.8}s;--delay:${-i * 0.9}s`;
    b.innerHTML = `<div class="frame"><div class="photo">${placeholder(i)}<img src="${esc(p.src)}" alt="" loading="lazy" decoding="async"></div></div>`;
    $('img', b).onerror = (e) => e.target.remove(); // missing file -> pixel placeholder shows
    b.onclick = () => openPhoto(i);
    $(i < half ? '#photosTop' : '#photosBottom', root).append(b);
    return b;
  });

  function openPhoto(i) {
    const p = photos[i];
    const card = openModal(
      `<div class="big-frame"><div class="photo">${placeholder(i, 6)}<img src="${esc(p.src)}" alt="${esc(p.caption)}"></div></div>
       <p class="caption">${esc(p.caption)}</p><p class="tiny">TAP ANYWHERE TO CLOSE</p>`,
      { closeAnywhere: true, label: p.caption },
    );
    $('img', card).onerror = (e) => e.target.remove();
  }

  // ---- drifting petals (the caught roses settling) ----
  const petals = $('.petals', root);
  const petalCount = RM ? 0 : 10;
  for (let i = 0; i < petalCount; i++) {
    const d = document.createElement('i');
    d.className = 'petal';
    d.style.cssText = `left:${Math.random() * 100}%;--dur:${10 + Math.random() * 8}s;--delay:${-Math.random() * 18}s;--drift:${(Math.random() * 80 - 40) | 0}px;background:${['#FF5FA2', '#FFFFFF', '#FF8CC0'][i % 3]}`;
    petals.append(d);
  }

  // ---- letter ----
  const pages = C.letter.pages;
  const letter = $('#letter', root), titleEl = $('#letterTitle', root), textEl = $('#letterText', root);
  const srEl = $('#letterSr', root), cont = $('#continue', root), dots = $('#pageDots', root);
  const finale = $('#finale', root), rain = $('.rain', root);
  let page = 0, i = 0, typing = false, timer = 0;

  function finishTyping() {
    clearInterval(timer);
    typing = false;
    textEl.textContent = pages[page].text;
    cont.classList.add('show');
  }

  function showPage(n) {
    page = n;
    const pg = pages[n];
    titleEl.textContent = pg.title || '';
    titleEl.hidden = !pg.title;
    srEl.textContent = `${pg.title || ''} ${pg.text}`;
    textEl.textContent = '';
    cont.classList.remove('show');
    dots.innerHTML = pages.map((_, k) => sprite(k <= n ? 'heart' : 'heartEmpty', 2)).join('');
    buttons.forEach((b, k) => b.classList.toggle('hl', k === pg.photo));
    letter.scrollTop = 0;
    letter.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
    i = 0;
    typing = true;
    clearInterval(timer);
    timer = setInterval(() => {
      textEl.textContent = pg.text.slice(0, ++i);
      if (i % 3 === 0) audio.tick();
      if (i >= pg.text.length) finishTyping();
    }, 28);
  }

  function next() {
    if (typing) return finishTyping(); // first tap skips the typewriter
    if (page < pages.length - 1) showPage(page + 1);
    else showFinale();
  }
  letter.addEventListener('click', next);
  letter.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
  });

  // ---- finale ----
  $('#finaleText', root).textContent = C.letter.finaleTitle;
  $('#finaleHeart', root).innerHTML = sprite('heart', 4);
  $('#signature', root).textContent = C.letter.signature;

  function showFinale() {
    letter.hidden = true;
    finale.hidden = false;
    buttons.forEach((b) => b.classList.remove('hl'));
    audio.jingle();
    const r = root.getBoundingClientRect();
    burst(root, r.width / 2, r.height / 2, RM ? 12 : 30, { kind: 'confetti', dist: r.width * 0.35, dur: 1200 });
    const variants = [undefined, 'white', undefined, 'gold'];
    for (let k = 0; k < (RM ? 5 : 12); k++) {
      const el = document.createElement('i');
      el.innerHTML = sprite('rose', 3, variants[k % 4]);
      el.style.cssText = `left:${Math.random() * 92}%;--dur:${7 + Math.random() * 6}s;--delay:${-Math.random() * 10}s;--drift:${(Math.random() * 60 - 30) | 0}px`;
      rain.append(el);
    }
    $('#againBtn', root).focus({ preventScroll: true });
  }

  $('#againBtn', root).onclick = () => begin();

  function begin() {
    rain.innerHTML = '';
    finale.hidden = true;
    letter.hidden = false;
    showPage(0);
  }

  initExtras(root);
  return { begin };
}
