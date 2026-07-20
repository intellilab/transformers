import { chat } from '@/util/ai';
import { pipeList, getOptionsDescription } from './pipe-list';

function buildPipeDescriptions(): string {
  return pipeList.map((p) => {
    const opts = getOptionsDescription(p);
    const optsStr = opts
      ? Object.entries(opts).map(([k, v]) => `  ${k}: ${v}`).join('\n')
      : '  (no options)';
    return `- ${p.meta.name}: ${p.meta.description}\n${optsStr}`;
  }).join('\n\n');
}

function buildSystemPrompt(): string {
  const pipeDescriptions = buildPipeDescriptions();
  return `You are a pipeline generator. The user provides their current pipeline and a request.
Your task is to output ONLY the pipeline text, nothing else.

Pipeline syntax:
- Each line is a pipe starting with "|>"
- Comments start with "#"
- Options are JSON5 inside parentheses: |> pipeName({ key: 'value' })

Available pipes:
${pipeDescriptions}

Rules:
- Only use pipes listed above
- Options are validated by Zod schemas — follow the described types
- Output ONLY the pipeline text, no explanation`;
}

export async function generatePipeline(userPrompt: string, currentPipeline: string): Promise<string | null> {
  const result = await chat([
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: `Current pipeline:\n${currentPipeline || '(empty)'}\n\nRequest: ${userPrompt}` },
  ]);
  if (!result) return null;
  return result.replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '').trim();
}
