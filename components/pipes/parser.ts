import JSON5 from 'json5';
import type { PipeHandlerInstance } from './types';

export interface ParsedPipe {
  name: string;
  options: Record<string, unknown>;
  line: number;
}

export interface ParseError {
  line: number;
  column: number;
  message: string;
}

export interface ParseResult {
  pipes: ParsedPipe[];
  errors: ParseError[];
}

export function parsePipeline(text: string, pipeHandlers?: PipeHandlerInstance[]): ParseResult {
  const result: ParseResult = {
    pipes: [],
    errors: [],
  };

  if (!text) return result;

  const handlerMap = pipeHandlers ? new Map(pipeHandlers.map((p) => [p.meta.name, p])) : undefined;

  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]!;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('|>')) {
      const parsed = parsePipeLine(trimmed, i + 1);
      if (parsed) {
        if (handlerMap && !handlerMap.has(parsed.name)) {
          result.errors.push({
            line: i + 1,
            column: 1,
            message: `Unknown pipe: ${parsed.name}`,
          });
        }
        if (handlerMap && parsed.options.__parseError === undefined) {
          const handler = handlerMap.get(parsed.name);
          if (handler?.optionsSchema) {
            const check = handler.optionsSchema.safeParse(parsed.options);
            if (!check.success) {
              result.errors.push({
                line: i + 1,
                column: 1,
                message: `Invalid options for '${parsed.name}': ${check.error.message}`,
              });
            }
          }
        }
        result.pipes.push(parsed);
      }
    } else {
      result.errors.push({
        line: i + 1,
        column: 1,
        message: `Unexpected statement: ${trimmed}`,
      });
    }
  }

  return result;
}

function parsePipeLine(text: string, lineNumber: number): ParsedPipe | null {
  const match = text.match(/^\s*\|>\s*(\w+)\s*(?:\(([^)]*)\))?\s*(?:#.*)?$/);
  if (!match) return null;

  const name = match[1]!;
  const optionsStr = match[2];

  let options: Record<string, unknown> = {};
  if (optionsStr?.trim()) {
    try {
      options = JSON5.parse(`{${optionsStr}}`) as Record<string, unknown>;
    } catch {
      try {
        options = JSON5.parse(optionsStr) as Record<string, unknown>;
      } catch {
        options = { __parseError: optionsStr };
      }
    }
  }

  return { name, options, line: lineNumber };
}

export function serializePipeline(
  pipes: { name: string; options: Record<string, unknown> }[],
  outputOptions?: Record<string, unknown>,
): string {
  const lines: string[] = [];

  for (const pipe of pipes) {
    const optionsStr = Object.keys(pipe.options).length > 0 ? JSON5.stringify(pipe.options) : '';
    lines.push(`|> ${pipe.name}(${optionsStr})`);
  }

  if (outputOptions && Object.keys(outputOptions).length > 0) {
    lines.push(`|> output(${JSON5.stringify(outputOptions)})`);
  }

  return lines.join('\n');
}
