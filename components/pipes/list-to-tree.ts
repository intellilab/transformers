import {
  TREE_BRANCH,
  TREE_BRANCH_LAST,
  TREE_EMPTY,
  TREE_INDENT_STR,
  TREE_LEADING,
  TREE_TRUNK,
} from '~/components/tree';
import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';

interface TreeItem {
  content: string;
  indent: number;
  level?: number;
  children?: TreeItem[];
}

interface TreeNode {
  content: string;
  indent: number;
  level: number;
  children: TreeNode[];
}

class ListToTreePipe extends PipeHandler {
  meta = {
    name: 'listToTree',
    description:
      'Parse an indented list into a hierarchical tree structure using indentation level as parent-child relationship',
  } satisfies PipeHandlerMeta;

  handle(input: string) {
    const items: TreeItem[] = input
      .split('\n')
      .map((line: string) => line.trimEnd())
      .filter(Boolean)
      .map((line: string) => {
        let indent = 0;
        while (line[indent] === ' ') indent += 1;
        let content = line.slice(indent);
        if (/^[-+*] /.test(content)) content = content.slice(2);
        return { content, indent };
      });

    const root: TreeNode = {
      content: '.',
      indent: -1,
      level: 0,
      children: [],
    };

    {
      const stack: TreeNode[] = [root];
      for (const item of items) {
        while (true) {
          const last = stack[stack.length - 1];
          if (!last) throw new Error('Stack underflow');
          if (item.indent > last.indent) break;
          stack.pop();
        }
        const last = stack[stack.length - 1]!;
        item.level = last.level + 1;
        last.children = [...(last.children || []), item as unknown as TreeNode];
        stack.push(item as unknown as TreeNode);
      }
    }

    {
      const stack: [TreeNode, number][] = [[root, 0]];
      const result = [root.content];
      while (stack.length) {
        const item = stack[stack.length - 1]!;
        const parent = item[0];
        const node = parent.children[item[1]];
        if (node) {
          item[1] += 1;
          const isLast = !parent.children[item[1]];
          const prefixes: string[] = stack
            .slice(0, -1)
            .map((anc) => (anc[0].children[anc[1]] ? TREE_TRUNK : TREE_EMPTY));
          const join = isLast ? TREE_BRANCH_LAST : TREE_BRANCH;
          prefixes.push(join + TREE_LEADING);
          result.push(prefixes.join(TREE_INDENT_STR) + node.content);
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
}

export default new ListToTreePipe();
