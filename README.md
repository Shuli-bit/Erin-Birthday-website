# Level 20 — a birthday game for Erin

Retro pink arcade: boot screen → catch 20 roses → LEVEL 20 UNLOCKED → letter with floating photos and hidden extras.
Static site, no backend, no tracking. Only dependency: Vite (dev only).

```
npm install
npm run dev      # also prints a Network URL you can open on your phone (same Wi-Fi)
npm run build    # outputs dist/
```

## Files

```
config.js        <- ALL editable text, captions, achievements, vouchers, bonus message
index.html       page skeleton + meta (noindex, neutral title)
public/photos/   your photos (photo1.jpg ... photo8.jpg)
src/main.js      boot screen, level-up, screen flow
src/game.js      rose-catching game loop
src/story.js     photos, typewriter letter, finale
src/extras.js    golden rose, energy can, trophies, vouchers, iOS update joke
src/sprites.js   pixel art (text grids -> inline SVG)
src/audio.js     8-bit Web Audio blips + level-up applause (on by default, mute toggle top-right)
src/ui.js        modal, toast, particles, localStorage helpers
src/style.css    all styling
```

## Swap in photos

1. Put images in `public/photos/` (photo1.jpg and photo2.jpg are already there).
2. Edit the `photos` list in `config.js` (`src` + `caption`). Up to 8. Any file that is missing shows a pixel placeholder.
3. Square-ish photos look best (they are cropped with `object-fit: cover`). Keep each under ~300 KB for a fast load on mobile data.
4. Each letter page can highlight a photo: set `photo: <index>` on that page (0 = first photo).

## Edit text

Everything is in `config.js`: letter pages, finale title and signature, the hint, `bonusMessage` (still says `[YOUR BONUS MESSAGE]`, so change it), the energy-can joke, achievements, vouchers and the iOS joke.

## Deploy

**Vercel:** push to GitHub → vercel.com → New Project → import the repo. Framework: Vite (auto-detected). Build command `npm run build`, output `dist`.

**Netlify:** push to GitHub → app.netlify.com → Add new site → import the repo. Build command `npm run build`, publish directory `dist`.
Or with no Git: run `npm run build` and drag the `dist` folder onto app.netlify.com/drop.

Then turn the URL into a QR code. Use one that doesn't track scans, or the URL itself.

## Before you send it

- Test on a **real iPhone** and on an **Android**, not only in desktop dev tools.
- iPhone: sound only plays if the ring/silent switch is **off silent**. Vibration doesn't work on iOS; the code skips it without errors.
- Revisiting the link shows REPLAY GAME / SKIP TO LETTER. To reset on your own phone, clear website data for the site.
- `prefers-reduced-motion` is respected: floating, shaking and petals calm down, and the game still works.
