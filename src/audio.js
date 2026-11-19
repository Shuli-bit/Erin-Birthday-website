// Tiny 8-bit sounds with Web Audio. On by default; the corner toggle mutes it.
let ctx = null;
let on = true;
let applause = null; // decoded level-up sound (public/sounds/)

async function loadApplause() {
  try {
    const res = await fetch('sounds/disney-applause.mp3');
    applause = await ctx.decodeAudioData(await res.arrayBuffer());
  } catch {}
}

function tone(freq, dur = 0.08, { type = 'square', when = 0, vol = 0.06, slide = 0 } = {}) {
  if (!on || !ctx) return;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const audio = {
  // Must run inside a tap handler (iOS rule).
  unlock() {
    try {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      if (!applause) loadApplause();
    } catch {}
  },
  // Played through the already-unlocked AudioContext so iOS allows it after the last tap.
  applause() {
    if (!on || !ctx || !applause) return;
    const src = ctx.createBufferSource();
    src.buffer = applause;
    src.connect(ctx.destination);
    src.start();
  },
  get on() { return on; },
  set on(v) { on = v; if (v) this.unlock(); },
  blip() { tone(880, 0.06); },
  tick() { tone(1400, 0.02, { vol: 0.015 }); },
  catch(n, gold) {
    const f = 392 * 2 ** ((n - 1) / 12);
    tone(f, 0.09);
    if (gold) tone(f * 1.5, 0.12, { when: 0.07 });
  },
  jingle() {
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
      tone(f, i === 6 ? 0.4 : 0.12, { when: i * 0.1 }));
  },
  powerUp() { tone(300, 0.28, { slide: 4, vol: 0.05 }); },
  stamp() { tone(160, 0.18, { type: 'triangle', slide: 0.4, vol: 0.12 }); },
};
