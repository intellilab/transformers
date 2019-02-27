import TOML from '@iarna/toml';

export function handle(input) {
  const obj = TOML.parse(input);
  return JSON.stringify(obj);
}

export const meta = {
  name: 'TOML to JSON',
  options: [],
};
