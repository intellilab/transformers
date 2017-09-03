import yaml from 'js-yaml';

export function handle(input, options) {
  const obj = JSON.parse(input);
  return yaml.safeDump(obj);
}

export const meta = {
  name: 'JSON to Yaml',
  options: [],
};
