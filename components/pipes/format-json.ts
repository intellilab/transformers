import { z } from 'zod';
import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';

class FormatJsonPipe extends PipeHandler {
  override optionsSchema = z.object({
    indent: z.number().default(2).describe('Number of spaces for indentation'),
    sortKeys: z.boolean().default(false).describe('Sort object keys alphabetically'),
  });

  meta = {
    name: 'formatJson',
    description:
      'Pretty-print a JSON string with configurable indentation and optional key sorting',
  } satisfies PipeHandlerMeta;

  handle(input: string, options?: Record<string, unknown>) {
    const { indent, sortKeys } = this.optionsSchema.parse(options ?? {});

    let data: unknown;
    try {
      data = JSON.parse(input);
    } catch {
      throw new Error('Input is not valid JSON');
    }

    if (sortKeys && typeof data === 'object' && data !== null) {
      data = sortObjectKeys(data);
    }

    return JSON.stringify(data, null, indent);
  }
}

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce(
        (sorted: Record<string, unknown>, key: string) => {
          sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
          return sorted;
        },
        {} as Record<string, unknown>,
      );
  }
  return obj;
}

export default new FormatJsonPipe();
