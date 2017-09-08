export function handle(input) {
  const bin = utf8Encode(input);
  return btoa(bin);
}

export const meta = {
  name: 'Text to Base64',
  options: [],
};

/* eslint-disable no-bitwise */
function utf8Encode(string) {
  const bytes = [];
  for (let i = 0; i < string.length; i += 1) {
    const code = string.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(
        (code >> 6) | 192,
        (code & 63) | 128,
      );
    } else {
      bytes.push(
        (code >> 12) | 224,
        ((code >> 6) & 63) | 128,
        (code & 63) | 128,
      );
    }
  }
  return String.fromCharCode(...bytes);
}
