import yaml from 'js-yaml';
import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';

class JsonToYamlPipe extends PipeHandler {
  meta = {
    name: 'jsonToYaml',
    description: 'Convert a JSON string into YAML format',
  } satisfies PipeHandlerMeta;

  handle(input: string) {
    const obj = JSON.parse(input);
    return yaml.dump(obj as any);
  }
}

export default new JsonToYamlPipe();
