import { puter } from '@heyputer/puter.js';
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

export async function generatePipeline(userPrompt: string, currentPipeline: string): Promise<string> {
  const systemPrompt = buildSystemPrompt();
  const userContent = `Current pipeline:\n${currentPipeline || '(empty)'}\n\nRequest: ${userPrompt}`;
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ] as any;
  const response = await puter.ai.chat(messages, { model: 'openai/gpt-5.4-nano' });
  const text = response?.message?.content ?? '';
  const cleaned = (typeof text === 'string' ? text : '').replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '').trim();
  return cleaned;
}
