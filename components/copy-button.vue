<template>
  <UButton
    v-bind="$attrs"
    :icon="copied ? 'i-mdi-check' : 'i-mdi-content-copy'"
    :color="copied ? 'success' : color"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  text?: string;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
}>(), {
  color: 'neutral',
});

const emit = defineEmits<{
  copy: [text: string];
}>();

const copied = ref(false);
let timer: ReturnType<typeof setTimeout>;

function onClick() {
  if (!props.text) return;
  navigator.clipboard.writeText(props.text);
  clearTimeout(timer);
  copied.value = true;
  emit('copy', props.text);
  timer = setTimeout(() => { copied.value = false; }, 2000);
}

onUnmounted(() => {
  clearTimeout(timer);
});
</script>