import { z } from 'zod';
import { format } from '@gera2ld/format-json';
import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';

class JsonToJsPipe extends PipeHandler {
  override optionsSchema = z.object({
    quoteAsNeeded: z.boolean().default(false).describe('Only quote property keys when needed'),
  });

  meta = {
    name: 'jsonToJs',
    description: 'Convert a JSON string into JavaScript object literal notation with optional quoteAsNeeded',
  } satisfies PipeHandlerMeta;

  handle(input: string, options?: Record<string, unknown>) {
    const { quoteAsNeeded } = this.optionsSchema.parse(options ?? {});
    const obj = JSON.parse(input);
    return format(obj as Record<string, unknown>, {
      quoteAsNeeded,
    });
  }
}

export default new JsonToJsPipe();
