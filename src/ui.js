// Shared bits: storage, haptics, particles, modal, toast.
import { sprite } from './sprites.js';

export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const vibrate = (p) => { try { navigator.vibrate?.(p); } catch {} };
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const KEY = 'erin20';
export const store = {
  get() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } },
  set(patch) { try { localStorage.setItem(KEY, JSON.stringify({ ...store.get(), ...patch })); } catch {} },
};

// ---- particles (capped) ----
const CAP = 70;
const COLORS = ['#FF5FA2', '#FFB6D5', '#FFFFFF', '#FF8CC0'];
let live = 0;
export function burst(parent, x, y, n = 8, { kind = 'petal', dist = 46, fall = 0, dur = 650 } = {}) {
  for (let i = 0; i < n && live < CAP; i++) {
    live++;
    const p = document.createElement('i');
    p.className = 'particle';
    const heart = kind === 'confetti' ? Math.random() < 0.45 : false;
    if (heart) p.innerHTML = sprite('heart', 3);
    else p.style.background = kind === 'gold' && i % 2 ? '#FFD34D' : COLORS[i % COLORS.length];
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    parent.append(p);
    const a = Math.random() * Math.PI * 2;
    const d = dist * (0.6 + Math.random());
    const dx = Math.cos(a) * d, dy = Math.sin(a) * d + fall * Math.random();
    p.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${(Math.random() * 540) | 0}deg) scale(.5)`, opacity: 0 },
      ],
      { duration: dur * (0.8 + Math.random() * 0.5), easing: 'cubic-bezier(.2,.7,.3,1)' },
    ).onfinish = () => { p.remove(); live--; };
  }
}

export function floatText(parent, x, y, text) {
  const el = document.createElement('div');
  el.className = 'floater';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.addEventListener('animationend', () => el.remove());
  parent.append(el);
}

// ---- modal ----
const modal = document.getElementById('modal');
const card = modal.querySelector('.modal-card');
let onClose = null, anywhere = false, lastFocus = null, gen = 0;

export function openModal(html, { closeAnywhere = false, label = 'Dialog', onClose: cb } = {}) {
  gen++;
  onClose?.();
  if (modal.hidden) lastFocus = document.activeElement;
  card.innerHTML = html;
  card.setAttribute('aria-label', label);
  anywhere = closeAnywhere;
  onClose = cb || null;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('open'));
  (card.querySelector('[data-close]') || card).focus({ preventScroll: true });
  return card;
}

export function closeModal() {
  if (modal.hidden) return;
  const g = ++gen;
  modal.classList.remove('open');
  onClose?.();
  onClose = null;
  setTimeout(() => {
    if (g !== gen) return;
    modal.hidden = true;
    card.innerHTML = '';
    lastFocus?.focus?.({ preventScroll: true });
  }, 160);
}

modal.addEventListener('click', (e) => {
  if (anywhere || e.target === modal || e.target.closest('[data-close]')) closeModal();
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ---- toast ----
const toastEl = document.getElementById('toast');
let toastTimer;
export function toast(text, ms = 4500) {
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}
