export function handle(input, options) {
  const obj = JSON.parse(input);
  return JSON.stringify(obj, null, options.indent);
}

export const meta = {
  name: 'Format JSON',
  options: [
    {
      name: 'indent',
      description: 'Indent',
      type: 'number',
      default: 2,
    },
  ],
};
