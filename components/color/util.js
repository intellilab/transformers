function assert(value, message = 'Assertion error') {
  if (!value) throw new Error(message);
}

function validate(color) {
  const { r, g, b, a } = color;
  [r, g, b].forEach(v => assert(v >= 0 && v <= 255));
  assert(a >= 0 && a <= 1);
  return color;
}

export function parseColor(input) {
  {
    // rgb(r,g,b) / rgba(r,g,b,a)
    const matches = input.match(/^\s*rgb(a?)\((\s*[\d.]+\s*(?:,\s*[\d.]+\s*)+)\)\s*$/);
    if (matches) {
      const [, hasA, value] = matches;
      const nums = value.split(',').map(s => +s.trim());
      assert(nums.length === 3 + !!hasA);
      if (!hasA) nums.push(1);
      const [r, g, b, a] = nums;
      return validate({ r, g, b, a });
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
      return validate({ r, g, b, a });
    }
  }
  assert(false);
}

export function reprColor(color) {
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
