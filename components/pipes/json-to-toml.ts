import TOML from '@iarna/toml';
import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';

class JsonToTomlPipe extends PipeHandler {
  meta = {
    name: 'jsonToToml',
    description: 'Convert a JSON string into TOML format',
  } satisfies PipeHandlerMeta;

  handle(input: string) {
    const obj = JSON.parse(input);
    return TOML.stringify(obj as any);
  }
}

export default new JsonToTomlPipe();
