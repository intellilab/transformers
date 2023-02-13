export function handle(input) {
  const obj = JSON.stringify(input);
  return obj;
}

export const meta = {
  name: 'JSON stringify',
  options: [],
};
