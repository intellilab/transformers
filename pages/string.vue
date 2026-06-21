<template>
  <div>
    <h1 class="text-3xl mb-4">String Pipes</h1>
    <div class="grid grid-cols-[2fr_1fr_2fr] gap-4 min-h-[60vh] min-w-[800px]">
      <!-- Input Column -->
      <div class="flex flex-col">
        <div class="flex items-center mb-2">
          <label class="font-bold">Input</label>
          <UButton
            v-if="state.input"
            icon="i-mdi-delete"
            size="xs"
            color="neutral"
            variant="ghost"
            class="ml-2"
            @click="state.input = ''"
          />
        </div>
        <textarea
          class="flex-1 p-2 w-full bg-transparent border border-default font-mono text-sm resize-none rounded"
          v-model="state.input"
          placeholder="Enter input data..."
          @input="onInputChange"
        ></textarea>
      </div>

      <!-- Pipes Column -->
      <div class="flex flex-col">
        <div class="flex items-center mb-2">
          <label class="font-bold">Pipes</label>
        </div>
        <div class="flex-1 flex flex-col">
          <textarea
            ref="pipelineEditor"
            class="flex-1 p-2 w-full bg-transparent border font-mono text-sm resize-none rounded"
            :class="state.pipelineError ? 'border-error' : 'border-default'"
            v-model="state.pipelineText"
            placeholder="# Example pipeline
|> toJson({ fromFormat: 'yaml' })
|> formatJson({ indent: 2 })"
            @input="execute"
          ></textarea>
          <div v-if="state.pipelineError" class="text-error text-xs mt-1">
            {{ state.pipelineError }}
          </div>
        </div>
      </div>

      <!-- Output Column -->
      <div class="flex flex-col">
        <div class="flex items-center mb-2">
          <label class="font-bold">Output</label>
          <UButton
            icon="i-mdi-content-copy"
            size="xs"
            variant="ghost"
            class="ml-auto"
            @click="onCopyOutput"
          />
        </div>
        <textarea
          class="flex-1 p-1 w-full bg-transparent border border-default font-mono text-sm resize-none rounded"
          readonly
          :value="state.output"
          placeholder="Output will appear here..."
        ></textarea>
      </div>
    </div>

    <!-- AI Prompt -->
    <form class="mt-4" @submit.prevent="onGenerate">
      <label class="font-bold">AI Prompt</label>
      <div class="flex gap-2 mt-1">
        <UInput
          class="flex-1"
          v-model="state.prompt"
          placeholder="Ask AI to generate pipeline... (e.g. convert YAML to JSON)"
          size="lg"
        />
        <UButton
          type="submit"
          icon="i-mdi-auto-fix"
          :loading="generating"
          :disabled="state.prompt.length < 5"
          size="lg"
          class="self-end shrink-0"
        >
          Generate
        </UButton>
      </div>
    </form>

    <!-- Share -->
    <div class="mt-4 flex items-center gap-2">
      <UButton @click="onShare">Share</UButton>
      <UInput
        v-if="shareContent"
        readonly
        class="flex-1"
        :value="shareContent.url"
        @click="onSelectAll"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { puter } from '@heyputer/puter.js';
import { parsePipeline } from '~/components/pipes/parser';
import { executePipeline } from '~/components/pipes/executor';
import { pipeList } from '~/components/pipes/pipe-list';
import { generatePipeline } from '~/components/pipes/ai';

const pipelineEditor = ref<HTMLTextAreaElement>();

const state = reactive<{
  input: string;
  output: string;
  pipelineText: string;
  pipelineError: string;
  prompt: string;
}>({
  input: '',
  output: '',
  pipelineText: '',
  pipelineError: '',
  prompt: '',
});

const shareContent = ref<{ url: string }>();

function execute() {
  const parsed = parsePipeline(state.pipelineText, pipeList);
  state.pipelineError = parsed.errors[0]?.message || '';
  if (parsed.errors.length > 0) return;
  const result = executePipeline(
    state.input,
    parsed.pipes.map((pipe) => ({
      name: pipe.name,
      options: pipe.options,
    })),
    pipeList,
  );

  if (result.error) {
    state.output = `Error: ${result.error.message}`;
  } else {
    state.output = result.output;
  }
}

function onInputChange() {
  execute();
}

function onCopyOutput() {
  if (state.output) {
    navigator.clipboard.writeText(state.output);
  }
}

function onSelectAll(e: MouseEvent) {
  (e.target as HTMLInputElement).select();
}

function onShare() {
  const { origin, pathname, search } = window.location;
  const query = {
    i: state.input,
    p: state.pipelineText,
  };
  let qs = Object.entries(query)
    .map(
      ([key, value]) => value && [key, value].map(encodeURIComponent).join('='),
    )
    .filter(Boolean)
    .join('&');
  qs = `${qs}&_=`;
  const url = `${origin}${pathname}${search}#${qs}`;
  shareContent.value = { url };
}

const generating = ref(false);
const toast = useToast();

async function onGenerate() {
  if (!state.prompt.trim() || generating.value) return;
  if (!puter.auth.isSignedIn()) {
    await puter.auth.signIn({ attempt_temp_user_creation: true });
  }
  generating.value = true;
  try {
    const result = await generatePipeline(state.prompt, state.pipelineText);
    if (result) {
      state.pipelineText = result;
      execute();
    }
    state.prompt = '';
  } catch (err: unknown) {
    toast.add({ title: 'Generation failed', description: err instanceof Error ? err.message : JSON.stringify(err), color: 'error', duration: 5000 });
  } finally {
    generating.value = false;
  }
}

onMounted(() => {
  const query = new URLSearchParams(window.location.hash.slice(1));
  try {
    const input = query.get('i');
    const pipelineText = query.get('p') || '';
    if (input != null) {
      state.input = input;
      state.pipelineText = pipelineText;
      execute();
    }
  } finally {
    window.location.hash = '';
  }
});
</script>
