import { defineAsyncComponent, reactive } from 'vue';
import { onThemeChange } from '../theme';

export const VlCode = defineAsyncComponent(() => import('./code'));

export const defaultOptions = reactive({
  theme: 'default',
});

onThemeChange((dark) => {
  defaultOptions.theme = dark ? 'material-darker' : 'default';
});
