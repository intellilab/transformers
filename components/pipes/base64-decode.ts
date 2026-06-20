import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';

class Base64DecodePipe extends PipeHandler {
  meta = {
    name: 'base64Decode',
    description: 'Decode a Base64-encoded string back to UTF-8 text',
  } satisfies PipeHandlerMeta;

  handle(input: string) {
    const bin = atob(input);
    return utf8Decode(bin);
  }
}

function utf8Decode(binary: string): string {
  const chars: number[] = [];
  let i = 0;
  let c1 = 0;
  let c2 = 0;
  let c3 = 0;
  while (i < binary.length) {
    c1 = binary.charCodeAt(i);
    if (c1 < 128) {
      chars.push(c1);
      i += 1;
    } else if (c1 > 191 && c1 < 224) {
      c2 = binary.charCodeAt(i + 1);
      chars.push(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = binary.charCodeAt(i + 1);
      c3 = binary.charCodeAt(i + 2);
      chars.push(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return String.fromCharCode(...chars);
}

export default new Base64DecodePipe();
