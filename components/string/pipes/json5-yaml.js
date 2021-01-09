import JSON5 from 'json5';
import yaml from 'js-yaml';

export function handle(input) {
  const obj = JSON5.parse(input);
  return yaml.dump(obj);
}

export const meta = {
  name: 'JSON5 to Yaml',
  options: [],
};
