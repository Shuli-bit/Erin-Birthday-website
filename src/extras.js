// Hidden extras on the story screen. All front-end only: nothing is sent anywhere.
import C from '../config.js';
import { sprite } from './sprites.js';
import { audio } from './audio.js';
import { openModal, esc, burst, floatText, toast, store, vibrate } from './ui.js';

const $ = (s, r = document) => r.querySelector(s);
const ORD = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH'];

export function initExtras(root) {
  $('#hint', root).textContent = C.hint;
  $('#trophyBtn', root).innerHTML = sprite('trophy', 4);
  $('#ticketBtn', root).innerHTML = sprite('checklist', 3);
  $('#phoneBtn', root).innerHTML = sprite('phone', 3);

  // 1. hidden golden rose -> bonus message (+ link to vouchers)
  const gold = $('#goldRose', root);
  gold.innerHTML = sprite('rose', 3, 'gold');
  gold.onclick = () => {
    audio.jingle();
    vibrate([15, 30, 15]);
    const card = openModal(
      `<h2 class="m-title">SECRET FOUND!</h2>
       <div class="m-art">${sprite('rose', 6, 'gold')}</div>
       <p class="m-body">${esc(C.bonusMessage)}</p>
       <button class="btn btn-primary" id="toVouchers">OPEN YOUR VOUCHERS</button>
       <button class="btn" data-close>CLOSE</button>`,
      { label: 'Secret found' },
    );
    $('#toVouchers', card).onclick = vouchers;
  };

  // 2. energy can drifting past now and then
  const can = $('#canBtn', root);
  can.innerHTML = sprite('can', 4);
  let anim = null;
  function drift() {
    if (!root.classList.contains('active')) return later();
    can.hidden = false;
    can.classList.remove('zapped');
    can.style.top = `${22 + Math.random() * 50}%`;
    const W = root.clientWidth;
    anim = can.animate(
      [{ transform: 'translateX(-60px)' }, { transform: `translateX(${W + 10}px)` }],
      { duration: 9000, easing: 'linear' },
    );
    anim.onfinish = () => { can.hidden = true; later(); };
  }
  const later = () => setTimeout(drift, 12000 + Math.random() * 10000);
  setTimeout(drift, 5000);
  can.onclick = () => {
    if (can.classList.contains('zapped')) return;
    anim?.pause();
    can.classList.add('zapped');
    audio.powerUp();
    vibrate([10, 20, 10, 20, 30]);
    const b = can.getBoundingClientRect(), r = root.getBoundingClientRect();
    floatText(root, b.left - r.left + b.width / 2, b.top - r.top, '+10 RECHARGED!');
    burst(root, b.left - r.left + b.width / 2, b.top - r.top + b.height / 2, 10, { kind: 'gold' });
    toast(C.canJoke);
    setTimeout(() => anim?.play(), 900);
  };

  // 3. achievements, arcade high-score style
  $('#trophyBtn', root).onclick = () => {
    const rows = C.achievements.map((a, i) => `
      <li style="--i:${i}">
        <span class="ico">${sprite(a.icon, 3)}<span class="rank">${ORD[i] || ''}</span></span>
        <span><b>${esc(a.name.toUpperCase())}</b><small>${esc(a.desc)}</small><span class="unl">UNLOCKED</span></span>
      </li>`).join('');
    openModal(
      `<h2 class="m-title">ACHIEVEMENTS</h2><p class="m-sub">HIGH SCORES - PLAYER ERIN</p>
       <ol class="ach">${rows}</ol><button class="btn btn-primary" data-close>CLOSE</button>`,
      { label: 'Achievements' },
    );
  };

  // 4. vouchers
  function vouchers() {
    const redeemed = new Set(store.get().redeemed || []);
    const html = C.coupons.map((c, i) => {
      const done = redeemed.has(i);
      return `<div class="ticket${done ? ' done' : ''}" data-i="${i}">
        <h3>${esc(c.title)}</h3><p>(${esc(c.note)})</p>
        <button class="btn btn-primary redeem" ${done ? 'disabled' : ''} aria-label="Redeem ${esc(c.title)}">${done ? 'REDEEMED' : 'REDEEM'}</button>
        <p class="msg" role="status">${done ? esc(C.redeemedMessage) : ''}</p>
        <div class="stamp" aria-hidden="true">REDEEMED</div>
      </div>`;
    }).join('');
    const card = openModal(
      `<h2 class="m-title">VOUCHERS</h2><p class="m-sub">valid forever. no refunds.</p>${html}
       <button class="btn" data-close>CLOSE</button>`,
      { label: 'Vouchers' },
    );
    card.querySelectorAll('.redeem').forEach((btn) => {
      btn.onclick = () => {
        const t = btn.closest('.ticket'), i = +t.dataset.i;
        t.classList.add('stamping');
        btn.disabled = true;
        btn.textContent = 'REDEEMED';
        $('.msg', t).textContent = C.redeemedMessage;
        audio.stamp();
        vibrate(40);
        redeemed.add(i);
        store.set({ redeemed: [...redeemed] });
      };
    });
  }
  $('#ticketBtn', root).onclick = vouchers;

  // 5. iPhone 13 "update" that never finishes
  $('#phoneBtn', root).onclick = () => {
    let t = 0;
    const card = openModal(
      `<div class="ios"><h2 class="m-title">iOS UPDATE</h2><p class="m-sub">${esc(C.iosVersion)}</p>
       <div class="bar"><div class="bar-fill"></div></div><p class="ios-pct">0.0%</p>
       <p class="ios-eta">Estimating time remaining...</p><p class="ios-msg" hidden></p>
       <button class="btn" data-close>CLOSE</button></div>`,
      { label: 'iOS update', onClose: () => clearInterval(t) },
    );
    const fill = $('.bar-fill', card), pct = $('.ios-pct', card), eta = $('.ios-eta', card), msg = $('.ios-msg', card);
    let p = 0, n = 0;
    t = setInterval(() => {
      n++;
      p += (99.4 - p) * 0.015; // crawls, never finishes
      fill.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      pct.textContent = p.toFixed(1) + '%';
      if (n === 35) eta.textContent = 'About 4 hours remaining';
      if (n === 65) eta.textContent = 'About 3 days remaining';
      if (n === 90) { msg.hidden = false; msg.textContent = C.iosMessage; }
    }, 100);
  };
}
