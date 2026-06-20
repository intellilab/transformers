import { z } from 'zod';
import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';

class JsonGetPipe extends PipeHandler {
  override optionsSchema = z.object({
    path: z.string().optional().describe('Dot-separated path to extract (e.g. "foo.bar")'),
  });

  meta = {
    name: 'jsonGet',
    description: 'Extract a nested value from a JSON string using a dot-separated path option (e.g. { path: "foo.bar" })',
  } satisfies PipeHandlerMeta;

  handle(input: string, options?: Record<string, unknown>) {
    const { path } = this.optionsSchema.parse(options ?? {});
    let data: unknown;
    try {
      data = JSON.parse(input);
    } catch (err: unknown) {
      throw new Error(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (path) {
      const parts = path.split('.').filter(Boolean);
      data = parts.reduce((prev: unknown, key: string) => (prev as Record<string, unknown>)?.[key], data);
    }

    return JSON.stringify(data);
  }
}

export default new JsonGetPipe();
