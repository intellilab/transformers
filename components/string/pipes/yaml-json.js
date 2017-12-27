import yaml from 'js-yaml';

export function handle(input) {
  const obj = yaml.safeLoad(input);
  return JSON.stringify(obj);
}

export const meta = {
  name: 'Yaml to JSON',
  options: [],
};
