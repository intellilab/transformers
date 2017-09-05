export function handle(input, options) {
  const bin = atob(input);
  return utf8Decode(bin);
}

export const meta = {
  name: 'Base64 to Text',
  options: [],
};

function utf8Decode(binary) {
  const chars = [];
  let i = 0;
  let c1 = 0;
  let c2 = 0;
  let c3 = 0;
  while (i < binary.length) {
    c1 = binary.charCodeAt(i);
    if (c1 < 128) {
      chars.push(c1);
      i += 1;
    } else if (c1 > 191 && c1 < 224) {
      c2 = binary.charCodeAt(i + 1);
      chars.push(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = binary.charCodeAt(i + 1);
      c3 = binary.charCodeAt(i + 2);
      chars.push(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return String.fromCharCode(...chars);
}
