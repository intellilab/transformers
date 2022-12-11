import { reactive } from 'vue';

export const toasts = reactive<Array<{ id: number; text: string }>>([]);
let id = 0;

export function showToast(text: string, duration = 2000) {
  id += 1;
  const item = {
    id,
    text,
  };
  toasts.push(item);
  const dismiss = () => {
    const index = toasts.indexOf(item);
    if (index >= 0) toasts.splice(index, 1);
  };
  if (duration) setTimeout(dismiss, duration);
  return dismiss;
}
