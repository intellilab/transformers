import { z } from 'zod';
import { PipeHandler } from '~/components/pipes/types';
import type { PipeHandlerMeta } from '~/components/pipes/types';
import yaml from 'js-yaml';
import TOML from '@iarna/toml';
import JSON5 from 'json5';

class ToJsonPipe extends PipeHandler {
  override optionsSchema = z.object({
    fromFormat: z.enum(['auto', 'yaml', 'toml', 'json']).default('auto').describe('Source format; auto detects from content'),
    indent: z.number().default(2).describe('Number of spaces for indentation'),
  });

  meta = {
    name: 'toJson',
    description: 'Parse input from a given format (auto, yaml, toml, json) and serialize it as a JSON string',
  } satisfies PipeHandlerMeta;

  handle(input: string, options?: Record<string, unknown>) {
    const { fromFormat, indent } = this.optionsSchema.parse(options ?? {});

    const sourceFormat = fromFormat === 'auto' ? detectFormat(input) : fromFormat;

    let data;
    switch (sourceFormat) {
      case 'yaml':
        data = yaml.load(input);
        break;
      case 'toml':
        data = TOML.parse(input);
        break;
      case 'json':
      default:
        data = JSON5.parse(input);
        break;
    }

    return JSON.stringify(data, null, indent);
  }
}

function detectFormat(input: string): string {
  const trimmed = input.trim();
  const first = trimmed[0];
  // Braces/brackets are almost certainly JSON — try that first
  if (first === '{' || first === '[') {
    return 'json';
  }
  if (trimmed.includes(':') || trimmed.startsWith('-')) {
    try { const p = yaml.load(trimmed); if (typeof p === 'object' && p) return 'yaml'; } catch {}
  }
  if (trimmed.match(/^[^\n]*=[^\n]*/m)) {
    try { const p = TOML.parse(trimmed); if (typeof p === 'object' && p) return 'toml'; } catch {}
  }
  return 'json';
}

export default new ToJsonPipe();
