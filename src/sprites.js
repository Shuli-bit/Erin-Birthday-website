// Pixel art as text grids -> inline SVG. One char = one pixel, "." = transparent.
const PAL = {
  o: '#8A2D5B', p: '#FF5FA2', l: '#FFB6D5', d: '#C93A7E', w: '#FFFFFF', c: '#FFF8F5',
  g: '#5BAA5B', G: '#2E7D4F', y: '#FFD34D', s: '#C9CED6', b: '#2B4C9B', r: '#E8344E',
  k: '#2A0F1E', t: '#E8B27A', u: '#C98A4B', e: '#BFE3FF',
};
const VARIANTS = {
  white: { p: '#FFFFFF', l: '#FFF8F5', d: '#FFB6D5' },
  gold: { p: '#FFD34D', l: '#FFF1A8', d: '#E0A100', o: '#8A5A00' },
};
const GRIDS = {
  rose: [
    '...oooooo...',
    '..olllpppo..',
    '.olpdddpppo.',
    '.opdlllddpo.',
    '.opdlpdldpo.',
    '.oppdddddpo.',
    '..oppppppo..',
    '...oooooo...',
    '.....gg.....',
    '..GG.gg.....',
    '..GGGgg.....',
    '...GGgg.GG..',
    '.....ggGGG..',
    '.....gg.....',
  ],
  heart: ['.pp.pp.', 'plppppp', 'ppppppp', '.ppppp.', '..ppp..', '...p...'],
  heartEmpty: ['.oo.oo.', 'o..o..o', 'o.....o', '.o...o.', '..o.o..', '...o...'],
  can: ['.ssss.', 'bbbbbb', 'bssssb', 'bsrrsb', 'bryyrb', 'bsrrsb', 'bssssb', 'bbbbbb', 'bbbbbb', '.ssss.'],
  cupcake: ['...rr...', '..lppp..', '.lppppp.', 'pppppppd', '.tutuut.', '.tutuut.', '..tutu..', '..uuuu..'],
  trophy: ['yyyyyyyy', 'y.ycyy.y', 'y.yyyy.y', '.yyyyyy.', '..yyyy..', '...yy...', '..oooo..', '.oooooo.'],
  car: ['...ppppp...', '..peepeepp.', '.peeepeeepp', 'ppppppppppy', 'pdpppppppdp', '.kk.....kk.'], // little pink A1
  checklist: ['...dddd...', 'oooddddooo', 'occcccccco', 'opcllllllo', 'occcccccco', 'opcllllcco', 'occcccccco', 'opclllllco', 'occcccccco', 'oooooooooo'],
  ticket: ['pppppppppp', 'pwwwowwwwp', '.wwwwwwww.', '.wwwowwww.', 'pwwwwwwwwp', 'pppppppppp'],
  phone: ['oooooo', 'oekkeo', 'oeeeeo', 'oeeeeo', 'oeeeeo', 'oeeeeo', 'oeeeeo', 'oeeeeo', 'oooooo'],
  soundOn: ['...o....', '..oo..o.', 'oooo.o.o', 'oooo.o.o', 'oooo.o.o', 'oooo.o.o', '..oo..o.', '...o....'],
  soundOff: ['...o....', '..oo....', 'oooo.o.o', 'oooo..o.', 'oooo.o.o', 'oooo....', '..oo....', '...o....'],
};

const cache = new Map();
export function sprite(name, px = 4, variant) {
  const key = `${name}|${px}|${variant}`;
  if (cache.has(key)) return cache.get(key);
  const rows = GRIDS[name];
  const pal = variant ? { ...PAL, ...VARIANTS[variant] } : PAL;
  let rects = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; ) {
      const ch = row[x];
      let w = 1;
      while (row[x + w] === ch) w++;
      if (ch !== '.') rects += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${pal[ch]}"/>`;
      x += w;
    }
  });
  const W = rows[0].length, H = rows.length;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * px}" height="${H * px}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${rects}</svg>`;
  cache.set(key, svg);
  return svg;
}
