// ============================================================
//  EDIT ME — every piece of text and every photo lives here.
//  Save the file and the page reloads with your changes.
// ============================================================

export default {
  // ---------- PHOTOS (max 8) ----------
  // Put your images in /public/photos/ and point `src` at them.
  // Missing files show a pixel placeholder, so you can add them later.
  // First half of the list floats above the letter, second half below.
  photos: [
    { src: 'photos/photo1.jpg', caption: 'SCHOOL DAYS' },
    { src: 'photos/photo2.jpg', caption: 'CHILL GUY ERA' },
    { src: 'photos/photo3.jpg', caption: 'NO.' },
    { src: 'photos/photo4.jpg', caption: 'UNHAND ME?!' },
    { src: 'photos/photo5.jpg', caption: 'TOO LAZY TO LOOK' },
    { src: 'photos/photo6.jpg', caption: 'EMAAN WITH AN E' },
  ],

  // ---------- THE LETTER ----------
  // One object per page. `title` is optional.
  // `photo` (optional) = index in the photos list above (0 = first photo)
  // to highlight while that page is showing. Delete it to highlight nothing.
  letter: {
    pages: [
      {
        title: 'MY WISH FOR YOU IN YOUR 20s',
        text: `I wish you an OT experience filled with more Red Bulls, fewer dead penises, and fewer worries about whether Apple is mysteriously sabotaging your iPhone 13.`,
        photo: 0,
      },
      {
        title: 'Dear Erin,',
        text: `Congrats on turning 20! I didn't think you'd make it this far, after all the times I've accidentally knocked your head into something, or "accidentally" (heavy air quotes) fed you nuts.`,
        photo: 1,
      },
      {
        text: `Looking back on everything we've shared, I realise how much you've shaped who I am today. As much as I hate to admit it, I don't think my style would be where it is today if it weren't for you.`,
        photo: 2,
      },
      {
        text: `Jokes aside, I'll never forget how you were there for me when things at home were really rough and my parents were going through a bad patch. You let me lean on you when I needed it most, and I don't think you know how much that meant. I'm so grateful to have someone like you in my life who pushes me to be a better Muslim. I hope this next chapter brings you everything you've worked so hard for.`,
        photo: 3,
      },
      {
        text: `Since you've been such a good shoulder for me to cry on, it only seems fair that I get some professional help in return. Please qualify quickly, because my anterior pelvic tilt isn't going to fix itself.`,
        photo: 4,
      },
      {
        text: `You will always be my tiny little brown girl.`,
        photo: 5,
      },
    ],
    finaleTitle: 'HAPPY 20TH ERIN', // a pixel heart is added after it
    signature: 'from Shububbles',
  },

  // ---------- HIDDEN EXTRAS ----------
  hint: 'psst... tap around 👀',

  // Shown when she finds the hidden golden rose.
  bonusMessage: '[YOUR BONUS MESSAGE]',

  // Shown when she taps the drifting energy can.
  canJoke: '+10 energy. Side effects include being unstoppable in the cadaver lab.',

  // Trophy panel. icon = one of: heart, rose, phone, can, cupcake, trophy, car
  achievements: [
    { name: 'Cadaver Survivor', desc: 'Stared death in the face. Took notes.', icon: 'heart' },
    { name: 'Apple Conspiracy Theorist', desc: 'Knows the iPhone 13 slowdown is personal.', icon: 'phone' },
    { name: 'Red Bull Connoisseur', desc: 'Can name the flavour blindfolded.', icon: 'can' },
    { name: 'Cupcake Architect', desc: 'Builds frosting skyscrapers for fun. 😋', icon: 'cupcake' },
    { name: 'Little Brown Girl', desc: 'Small in size, enormous in heart.', icon: 'rose' },
    { name: 'Hill Start Survivor', desc: 'Rolls back on every hill. Got the manual licence anyway.', icon: 'car' },
  ],

  // Vouchers panel (ticket icon, or found via the golden rose).
  coupons: [
    { title: 'ONE FREE MASSAGE', note: 'REDEEMABLE POST-QUALIFICATION' },
    { title: 'ONE ANTERIOR PELVIC TILT CONSULTATION', note: 'technically physio territory, exceptions apply' },
  ],
  redeemedMessage: 'REDEEMED! Show this screen to Shuaib.',

  // Fake iOS update (tiny phone icon, top-left of the letter screen).
  iosVersion: 'iOS 13.0.0.0.0.1 (for iPhone 13 mini only)',
  iosMessage: 'Apple is definitely doing this on purpose.',
};
