<template>
  <form @submit.prevent="onSubmit" class="p-4 space-y-3">
    <UTextarea
      class="block"
      v-model="prompt"
      :placeholder="placeholder"
      :rows="rows"
    />
    <UButton
      type="submit"
      icon="i-mdi-auto-fix"
      :loading="loading"
      :disabled="prompt.length < minLength"
      block
    >
      Generate
    </UButton>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    onGenerate: (prompt: string) => Promise<void>;
    placeholder?: string;
    rows?: number;
    minLength?: number;
  }>(),
  {
    rows: 5,
    minLength: 5,
  },
);

const prompt = ref('');
const loading = ref(false);
const toast = useToast();

async function onSubmit() {
  if (!prompt.value.trim() || loading.value) return;
  loading.value = true;
  try {
    await props.onGenerate(prompt.value);
    prompt.value = '';
  } catch (err: unknown) {
    toast.add({
      title: 'Generation failed',
      description: err instanceof Error ? err.message : JSON.stringify(err),
      color: 'error',
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
}
</script>
