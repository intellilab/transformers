<template>
  <div class="flex gap-2">
    <UInput
      readonly
      class="flex-1"
      :value="url"
      @click="onSelectAll"
    />
    <UButton
      :icon="copied ? 'i-mdi-check' : 'i-mdi-content-copy'"
      :color="copied ? 'success' : 'neutral'"
      variant="ghost"
      size="sm"
      class="shrink-0"
      @click="onCopy"
    />
    <UButton
      icon="i-mdi-close"
      color="neutral"
      variant="ghost"
      size="sm"
      class="shrink-0"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ url: string }>();
defineEmits<{ close: [] }>();

const copied = ref(false);
let timer: ReturnType<typeof setTimeout>;

function onCopy() {
  navigator.clipboard.writeText(props.url);
  clearTimeout(timer);
  copied.value = true;
  timer = setTimeout(() => { copied.value = false; }, 2000);
}

function onSelectAll(e: MouseEvent) {
  (e.target as HTMLInputElement).select();
}
</script>
