export function handle(input) {
  const items = input.split('\n')
    .map(line => line.trimEnd())
    .filter(Boolean)
    .map(line => {
      let indent = 0;
      while (line[indent] === ' ') indent += 1;
      let content = line.slice(indent);
      if (/^[-+*] /.test(content)) content = content.slice(2);
      return { content, indent };
    });
  const root = {
    content: '.',
    indent: -1,
    level: 0,
    children: [],
  };
  {
    const stack = [root];
    for (const item of items) {
      let last;
      while (true) {
        last = stack[stack.length - 1];
        if (item.indent > last.indent) break;
        stack.pop();
      }
      item.level = last.level + 1;
      last.children = [...last.children || [], item];
      stack.push(item);
    }
  }
  {
    const stack = [[root, 0]];
    const result = [root.content];
    while (stack.length) {
      const item = stack[stack.length - 1];
      const parent = item[0];
      const node = parent.children[item[1]];
      if (node) {
        item[1] += 1;
        const isLast = !parent.children[item[1]];
        const prefixes = stack.slice(0, -1)
          .map(anc => (anc[0].children[anc[1]] ? '│' : ' '));
        const join = isLast ? '└' : '├';
        prefixes.push(`${join}── `);
        result.push(prefixes.join('   ') + node.content);
        if (node?.children?.length) {
          stack.push([node, 0]);
        }
      } else {
        stack.pop();
      }
    }
    return result.join('\n');
  }
}

export const meta = {
  name: 'Markdown list to tree',
  options: [],
};
