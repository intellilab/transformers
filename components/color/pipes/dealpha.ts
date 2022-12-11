import { parseColor } from '../util';

const white = { r: 255, g: 255, b: 255, a: 1 };

export function handle(input: IColor, options?: { bg?: IColor }) {
  const bg = parseColor(options?.bg) || white;
  let { r, g, b } = input;
  const { a } = input;
  r = r * a + bg.r * (1 - a);
  g = g * a + bg.g * (1 - a);
  b = b * a + bg.b * (1 - a);
  return { r, g, b, a: 1 };
}

export const meta: IPipe['meta'] = {
  name: 'Dealpha',
  options: [
    { type: 'input', name: 'bg', description: 'Background color', default: '#fff', normalize: parseColor },
  ],
};
