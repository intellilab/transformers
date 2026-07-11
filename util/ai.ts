import { puter } from '@heyputer/puter.js';

export async function chat(messages: { role: string; content: string }[]): Promise<string | null> {
  if (!puter.auth.isSignedIn()) {
    await puter.auth.signIn({ attempt_temp_user_creation: true });
  }
  const response = await puter.ai.chat(messages as any, { model: 'deepseek/deepseek-v4-flash' });
  const text = response?.message?.content ?? '';
  return typeof text === 'string' ? text.trim() : null;
}
