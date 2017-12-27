import JSON5 from 'json5';

export function handle(input, options) {
  const obj = JSON5.parse(input);
  return JSON.stringify(obj, null, options.indent);
}

export const meta = {
  name: 'JSON5 to JSON',
  options: [
    {
      name: 'indent',
      description: 'Indent',
      type: 'number',
      default: 2,
    },
  ],
};
