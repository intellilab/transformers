import JSON5 from 'json5';
import TOML from '@iarna/toml';

export function handle(input) {
  const obj = JSON5.parse(input);
  return TOML.stringify(obj);
}

export const meta = {
  name: 'JSON5 to TOML',
  options: [],
};
