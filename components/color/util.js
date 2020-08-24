function assert(value, message = 'Assertion error') {
  if (!value) throw new Error(message);
}

function normalizeRgb(v) {
  if (typeof v === 'string') {
    v = v.trim();
    if (v.endsWith('%')) v = +v.slice(0, -1) * 2.55;
    else v = +v;
  }
  assert(!isNaN(v));
  return Math.max(0, Math.min(255, v));
}

function normalizeAlpha(a) {
  a = +a;
  assert(!isNaN(a));
  return Math.max(0, Math.min(1, a));
}

function normalize(color) {
  let { r, g, b, a } = color;
  return {
    r: normalizeRgb(r),
    g: normalizeRgb(g),
    b: normalizeRgb(b),
    a: normalizeAlpha(a),
  };
}

export function parseColor(input) {
  {
    // rgb(r,g,b) / rgba(r,g,b,a)
    const matches = input.match(/^\s*rgb(a?)\((.*?)\)\s*$/);
    if (matches) {
      const [, hasA, value] = matches;
      const nums = value.split(',');
      assert(nums.length === 3 + !!hasA);
      if (!hasA) nums.push(1);
      const [r, g, b, a] = nums;
      return normalize({ r, g, b, a });
    }
  }
  {
    // hsl(h,s,l) / hsla(h,s,l,a)
    const matches = input.match(/^\s*hsl(a?)\((.*?)\)\s*$/);
    if (matches) {
      const [, hasA, value] = matches;
      const nums = value.split(',');
      assert(nums.length === 3 + !!hasA);
      let [h, s, l] = nums;
      h = ((h % 360 + 360) % 360) / 360;
      assert(s.endsWith('%'));
      s = +s.slice(0, -1) / 100;
      assert(l.endsWith('%'));
      l = +l.slice(0, -1) / 100;
      const [r, g, b] = hsl2rgb(h, s, l).map(v => v * 255);
      const a = hasA ? nums[3] : 1;
      return normalize({ r, g, b, a });
    }
  }
  {
    // #rgba
    const matches = input.match(/^\s*#([0-9a-fA-F]{3,8})\s*$/);
    if (matches) {
      const [, value] = matches;
      assert([3, 4, 6, 8].includes(value.length));
      const isShort = value.length < 6;
      const unit = isShort ? 1 : 2;
      const [r, g, b, ha] = Array.from({ length: 4 }, (_, i) => value.slice(i * unit, i * unit + unit))
        .map(v => parseInt(v, 16) * (isShort ? 0x11 : 1));
      const a = isNaN(ha) ? 1 : ha / 255;
      return normalize({ r, g, b, a });
    }
  }
  assert(false);
}

export function reprHex(color) {
  const { r, g, b, a } = color;
  const items = [r, g, b].map(v => Math.floor(v));
  if (a !== 1) items.push(Math.floor(a * 255));
  const value = items.reduce((r, v) => r * 256 + v);
  let hex = value.toString(16).padStart(items.length * 2, '0');
  if (value % 0x11 === 0) {
    hex = Array.from(items, (_, i) => hex[i * 2]).join('');
  }
  return `#${hex}`;
}

export function reprRgba(color) {
  let { r, g, b, a } = color;
  r = ~~r;
  g = ~~g;
  b = ~~b;
  a = `${+a.toFixed(3)}`.replace(/^0/, '');
  if (a === '1') return `rgb(${r},${g},${b})`;
  return `rgba(${r},${g},${b},${a})`;
}

export function reprHsla(color) {
  const { r, g, b } = color;
  let [h, s, l] = rgb2hsl(...[r, g, b].map(v => v / 255));
  h = ~~(h * 360);
  s = ~~(s * 100);
  l = ~~(l * 100);
  const a = `${+color.a.toFixed(3)}`.replace(/^0/, '');
  if (a === '1') return `hsl(${h},${s}%,${l}%)`;
  return `hsla(${h},${s}%,${l}%,${a})`;
}

function hsl2rgb(h, s, l) {
  const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  const m1 = l * 2 - m2;
  const r = hue2rgb(m1, m2, h + 1 / 3);
  const g = hue2rgb(m1, m2, h);
  const b = hue2rgb(m1, m2, h - 1 / 3);
  return [r, g, b];
}

function hue2rgb(m1, m2, h) {
  if (h < 0) h += 1;
  else if (h > 1) h -= 1;
  if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
  if (h * 2 < 1) return m2;
  if (h * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  return m1;
}

function rgb2hsl(R, G, B) {
  const Cmin = Math.min(R, G, B);
  const Cmax = Math.max(R, G, B);
  const chroma = Cmax - Cmin;
  const L = (Cmin + Cmax) / 2;
  return [
    hue(R, G, B, Cmax, chroma),
    chroma === 0 ? 0 : chroma / (1 - Math.abs(2 * L - 1)),
    L,
  ];
}

function hue(R, G, B, Cmax, chroma) {
  let H;
  if (chroma === 0) {
    return H;
  }
  if (Cmax === R) {
    H = ((G - B) / chroma) % 6;
  } else if (Cmax === G) {
    H = ((B - R) / chroma) + 2;
  } else if (Cmax === B) {
    H = ((R - G) / chroma) + 4;
  }
  H *= 60;
  return H < 0 ? H + 360 : H;
}
