const white = { r: 255, g: 255, b: 255, a: 1 };

export function handle(input) {
  let { r, g, b } = input;
  const { a } = input;
  r = r * a + white.r * (1 - a);
  g = g * a + white.g * (1 - a);
  b = b * a + white.b * (1 - a);
  return { r, g, b, a: 1 };
}

export const meta = {
  name: 'Dealpha',
  options: [],
};
