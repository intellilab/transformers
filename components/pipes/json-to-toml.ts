import * as toml from 'js-toml';
import type { PipeHandlerMeta } from '~/components/pipes/types';
import { PipeHandler } from '~/components/pipes/types';

class JsonToTomlPipe extends PipeHandler {
  meta = {
    name: 'jsonToToml',
    description: 'Convert a JSON string into TOML format',
  } satisfies PipeHandlerMeta;

  handle(input: string) {
    const obj = JSON.parse(input);
    return toml.dump(obj as any);
  }
}

export default new JsonToTomlPipe();
