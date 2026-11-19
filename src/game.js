// Screen 2: catch 20 roses. No losing, no penalties.
import { sprite } from './sprites.js';
import { audio } from './audio.js';
import { burst, floatText, vibrate, RM } from './ui.js';

const GOAL = 20;
const MAX_ROSES = 7;
const ART = { pink: sprite('rose', 5), white: sprite('rose', 5, 'white'), gold: sprite('rose', 5, 'gold') };

export function runGame(root, onWin) {
  const field = root.querySelector('#field');
  const counter = root.querySelector('#counter');
  const num = counter.querySelector('.num');
  const hp = root.querySelector('.hp-fill');
  const instr = root.querySelector('#instruction');
  const status = root.querySelector('#gameStatus');

  field.innerHTML = '';
  num.textContent = '0';
  counter.style.setProperty('--s', 1);
  counter.classList.remove('dramatic', 'won');
  hp.style.transform = 'scaleX(0)';
  instr.classList.remove('gone');

  let W = field.clientWidth, H = field.clientHeight;
  const onResize = () => { W = field.clientWidth; H = field.clientHeight; };
  addEventListener('resize', onResize);

  let count = 0, done = false, spawnIn = 0.3, last = performance.now(), raf;
  const roses = [];

  function place(r) {
    r.x = 6 + Math.random() * Math.max(0, W - r.size - 12);
    r.y = -r.size - Math.random() * 40;
    r.vy = 95 + Math.random() * 75; // px/s: brisk but still easy to tap
  }

  function spawn() {
    const gold = Math.random() < 1 / 8;
    const size = (58 + Math.random() * 26) | 0; // >= 56px hit area, plus ::before padding
    const el = document.createElement('button');
    el.className = 'rose' + (gold ? ' gold' : '');
    el.setAttribute('aria-label', gold ? 'Golden rose, worth 2' : 'Rose');
    el.innerHTML = gold ? ART.gold : Math.random() < 0.5 ? ART.pink : ART.white;
    el.style.width = el.style.height = size + 'px';
    const r = { el, size, gold, t: 0, phase: Math.random() * 6.3, sway: RM ? 0 : 6 + Math.random() * 10 };
    place(r);
    field.append(el);
    roses.push(r);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    spawnIn -= dt;
    if (spawnIn <= 0 && roses.length < MAX_ROSES) { spawn(); spawnIn = 0.35 + Math.random() * 0.4; }
    for (const r of roses) {
      r.t += dt;
      r.y += r.vy * dt;
      if (r.y > H) place(r); // fell off-screen: respawn at the top, so she always gets to 20
      const x = r.x + Math.sin(r.t * 1.2 + r.phase) * r.sway;
      const rot = RM ? 0 : Math.sin(r.t * 0.9 + r.phase) * 12;
      r.el.style.transform = `translate3d(${x}px,${r.y}px,0) rotate(${rot}deg)`;
    }
    if (!done) raf = requestAnimationFrame(frame);
  }

  function render() {
    num.textContent = count;
    // 1x at 1 catch -> ~3.6x at 19, 4x at 20
    const s = count >= GOAL ? 4 : 1 + ((Math.max(1, count) - 1) * 2.6) / 18;
    counter.style.setProperty('--s', s.toFixed(3));
    const k = RM ? 0 : 1; // bounce + wiggle on every catch
    num.animate(
      [
        { transform: `scale(1.6) rotate(${-9 * k}deg)` },
        { transform: `scale(.92) rotate(${7 * k}deg)`, offset: 0.4 },
        { transform: `scale(1.05) rotate(${-3 * k}deg)`, offset: 0.7 },
        { transform: 'scale(1) rotate(0)' },
      ],
      { duration: 380, easing: 'ease-out' },
    );
    counter.classList.toggle('dramatic', count === GOAL - 1);
    hp.style.transform = `scaleX(${count / GOAL})`;
    instr.classList.add('gone');
    status.textContent = `${count} of ${GOAL} roses`;
  }

  function onTap(e) {
    const el = e.target.closest('.rose');
    if (!el || done) return;
    const i = roses.findIndex((r) => r.el === el);
    if (i < 0) return;
    e.preventDefault();
    const [r] = roses.splice(i, 1);
    const b = el.getBoundingClientRect(), f = field.getBoundingClientRect();
    const cx = b.left - f.left + b.width / 2, cy = b.top - f.top + b.height / 2;
    el.classList.add('caught');
    el.disabled = true;
    setTimeout(() => el.remove(), 300);

    count = Math.min(GOAL, count + (r.gold ? 2 : 1));
    burst(field, cx, cy, r.gold ? 14 : 8, { kind: r.gold ? 'gold' : 'petal' });
    if (r.gold) floatText(field, cx, cy - 20, '+2');
    vibrate(r.gold ? [18, 40, 18] : 14);
    audio.catch(count, r.gold);
    render();

    if (count >= GOAL) {
      done = true;
      cancelAnimationFrame(raf);
      field.removeEventListener('pointerdown', onTap);
      removeEventListener('resize', onResize);
      roses.forEach((x) => x.el.classList.add('leave'));
      setTimeout(onWin, 450);
    }
  }

  field.addEventListener('pointerdown', onTap);
  raf = requestAnimationFrame(frame);
}
