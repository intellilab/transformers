import type { PipeHandlerInstance } from './types';

export interface PipelineResult {
  output: string;
  error: { pipeIndex: number; pipeName: string; message: string } | null;
}

export interface PipeConfig {
  name: string;
  options: Record<string, unknown>;
}

export function executePipeline(
  inputText: string,
  pipes: PipeConfig[],
  pipeHandlers: PipeHandlerInstance[],
): PipelineResult {
  let currentData = inputText;

  for (let i = 0; i < pipes.length; i += 1) {
    const pipeConfig = pipes[i]!;
    const pipeHandler = pipeHandlers.find((p) => p.meta.name === pipeConfig.name);

    if (!pipeHandler) {
      return {
        output: currentData,
        error: {
          pipeIndex: i,
          pipeName: pipeConfig.name,
          message: `Pipe not found: ${pipeConfig.name}`,
        },
      };
    }

    try {
      currentData = pipeHandler.handle(currentData, pipeConfig.options);
    } catch (err: unknown) {
      return {
        output: currentData,
        error: {
          pipeIndex: i,
          pipeName: pipeConfig.name,
          message: `Pipe '${pipeConfig.name}' failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      };
    }
  }

  return { output: currentData, error: null };
}
