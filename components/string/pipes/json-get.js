import JSON5 from 'json5';

export function handle(input, options) {
  let obj = JSON5.parse(input);
  if (options.path)
    obj = options.path
      .split('.')
      .filter(Boolean)
      .reduce((prev, key) => prev?.[key], obj);
  return JSON.stringify(obj);
}

export const meta = {
  name: 'JSON get',
  options: [
    {
      name: 'path',
      description: 'Path',
      type: 'input',
      default: '',
    },
  ],
};
