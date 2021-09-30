import JSON5 from 'json5';

export function handle(input, options) {
  const obj = JSON5.parse(input);
  if (typeof obj !== 'string') throw new Error('Cannot parse JSON');
  return obj;
}

export const meta = {
  name: 'JSON parse',
  options: [],
};
