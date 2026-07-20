import { chat } from '@/util/ai';
import { CURVES_SYSTEM_PROMPT } from './config';

export async function generateCurves(
  userPrompt: string,
  currentCode: string,
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number },
): Promise<string | null> {
  const result = await chat([
    { role: 'system', content: CURVES_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Viewport: x=[${viewport.xMin}, ${viewport.xMax}], y=[${viewport.yMin}, ${viewport.yMax}]
Current code:
${currentCode || '(empty)'}

Request: ${userPrompt}`,
    },
  ]);
  if (!result) return null;
  return result.replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '').trim();
}
