import type { z } from 'zod';
import type { PipeHandlerInstance } from './types';

import formatJson from './format-json';
import jsonGet from './json-get';
import jsonToJs from './json-to-js';
import jsonToYaml from './json-to-yaml';
import jsonToToml from './json-to-toml';
import base64Decode from './base64-decode';
import base64Encode from './base64-encode';
import toJson from './to-json';
import listToTree from './list-to-tree';
import treeToList from './tree-to-list';

export const pipeList: PipeHandlerInstance[] = [
  formatJson,
  jsonGet,
  jsonToJs,
  jsonToYaml,
  jsonToToml,
  base64Decode,
  base64Encode,
  toJson,
  listToTree,
  treeToList,
];

export function getPipeHandler(name: string): PipeHandlerInstance | undefined {
  return pipeList.find((p) => p.meta.name === name);
}

export function describeOptions(schema: z.ZodObject<any>): Record<string, string> {
  const entries = Object.entries(schema.shape ?? {});
  if (entries.length === 0) return {};
  return Object.fromEntries(
    entries.map(([key, field]) => [key, (field as z.ZodTypeAny).description ?? key]),
  );
}

export function getOptionsDescription(pipe: PipeHandlerInstance): Record<string, string> | null {
  if (!pipe.optionsSchema) return null;
  if (pipe.optionsSchema instanceof Object && 'shape' in pipe.optionsSchema) {
    return describeOptions(pipe.optionsSchema as z.ZodObject<any>);
  }
  return null;
}
