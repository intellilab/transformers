import { TREE_BRANCH, TREE_BRANCH_LAST, TREE_INDENT, TREE_LEADING } from '~/components/tree';

export function handle(input) {
  const lines = input.split('\n');
  // lines[0] === '.'
  const result = [];
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    let o = line.indexOf(TREE_BRANCH);
    if (o < 0) o = line.indexOf(TREE_BRANCH_LAST);
    if (o < 0 || line.slice(o + 1, o + TREE_INDENT) !== TREE_LEADING) throw new Error('Invalid input');
    const level = Math.floor(o / TREE_INDENT);
    const indent = '  '.repeat(level);
    result.push(`${indent}- ${line.slice(o + TREE_INDENT)}`);
  }
  return result.join('\n');
}

export const meta = {
  name: 'Tree to Markdown list',
  options: [],
};
