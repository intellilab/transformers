<template>
  <div class="p-4">
    <div v-if="url" class="flex items-start gap-2">
      <UTextarea readonly class="flex-1" :value="url" @click="onSelectAll" :rows="5" />
      <UButton
        :icon="copied ? 'i-mdi-check' : 'i-mdi-content-copy'"
        :color="copied ? 'success' : 'neutral'"
        variant="ghost"
        size="sm"
        class="shrink-0"
        @click="onCopy"
      />
    </div>
    <p v-else class="text-sm text-dimmed">Nothing to share.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  getParams: () => Record<string, string | null | undefined> | null;
}>();

function buildUrl(): string | null {
  const params = props.getParams();
  if (!params) return null;
  const entries = Object.entries(params).filter(([, v]) => v != null);
  if (!entries.length) return null;
  const { origin, pathname, search } = window.location;
  let qs = entries.map(([k, v]) => [k, encodeURIComponent(v!)].join('=')).join('&');
  qs = `${qs}&_=`;
  return `${origin}${pathname}${search}#${qs}`;
}

const url = ref<string | null>(buildUrl());

const copied = ref(false);
let timer: ReturnType<typeof setTimeout>;

function onCopy() {
  if (!url.value) return;
  navigator.clipboard.writeText(url.value);
  clearTimeout(timer);
  copied.value = true;
  timer = setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function onSelectAll(e: MouseEvent) {
  (e.target as HTMLInputElement).select();
}
</script>
