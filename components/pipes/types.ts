import type { z } from 'zod';

export interface PipeHandlerMeta {
  name: string;
  description: string;
}

export interface PipeValue {
  name: string;
  options: Record<string, unknown>;
}

export interface PipeHandlerInstance {
  meta: PipeHandlerMeta;
  optionsSchema?: z.ZodTypeAny;
  handle(input: string, options?: Record<string, unknown>): string;
}

export abstract class PipeHandler implements PipeHandlerInstance {
  abstract meta: PipeHandlerMeta;
  optionsSchema?: z.ZodTypeAny;
  abstract handle(input: string, options?: Record<string, unknown>): string;
}

export interface IColor {
  r: number;
  g: number;
  b: number;
  a: number;
}
