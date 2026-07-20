import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';

class Base64EncodePipe extends PipeHandler {
  meta = {
    name: 'base64Encode',
    description: 'Encode a UTF-8 text string into Base64',
  } satisfies PipeHandlerMeta;

  handle(input: string) {
    const bin = utf8Encode(input);
    return btoa(bin);
  }
}

function utf8Encode(string: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < string.length; i += 1) {
    const code = string.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push((code >> 6) | 192, (code & 63) | 128);
    } else {
      bytes.push((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
    }
  }
  return String.fromCharCode(...bytes);
}

export default new Base64EncodePipe();
