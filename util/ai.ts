import { asyncMemo } from '@gera2ld/async-memo';
import { simpleRequest } from '@gera2ld/common';
import { puter } from '@heyputer/puter.js';

const loadModel = asyncMemo(async () => {
  const { puter } = await simpleRequest(
    'https://config.bananatree.dev/api/config/agent/transformers/models.yaml?type=json',
  ).json<{ puter: string }>();
  return puter;
});

export async function chat(messages: { role: string; content: string }[]): Promise<string | null> {
  if (!puter.auth.isSignedIn()) {
    await puter.auth.signIn({ attempt_temp_user_creation: true });
  }
  const model = await loadModel.call();
  const response = await puter.ai.chat(messages as any, { model });
  const text = response?.message?.content ?? '';
  return typeof text === 'string' ? text.trim() : null;
}
