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
          <UButton icon="i-mdi-help-circle-outline" size="xs" color="neutral" variant="ghost" class="ml-1" @click="showHelp = true" />
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

    <UModal v-model:open="showHelp" title="Available Pipes" class="max-w-2xl">
      <template #body>
        <UInput v-model="helpSearch" type="search" placeholder="Search pipes..." icon="i-mdi-magnify" class="block mb-4" size="sm" />
        <div class="space-y-4 text-sm h-96 overflow-y-auto">
          <div v-if="filteredPipes.length === 0" class="text-gray-500 text-center py-8">No pipes found</div>
          <div v-for="pipe in filteredPipes" :key="pipe.meta.name" class="border border-default rounded p-3">
            <div class="font-bold text-base mb-1 flex items-center gap-2">
              <span>|> {{ pipe.meta.name }}</span>
              <UButton v-if="copiedPipe === pipe.meta.name" icon="i-mdi-check" size="xs" color="success" variant="ghost" class="shrink-0" />
              <UButton v-else icon="i-mdi-content-copy" size="xs" color="neutral" variant="ghost" class="shrink-0" @click="onCopyPipe(pipe)" />
            </div>
            <div class="text-gray-600 dark:text-gray-400 mb-2">{{ pipe.meta.description }}</div>
            <div v-if="pipe.optionsSchema">
              <div class="font-semibold text-xs uppercase tracking-wide mb-1 text-gray-500">Options</div>
              <div class="space-y-1">
                <div v-for="(desc, key) in getOptionsDescription(pipe)" :key="key" class="flex gap-2">
                  <code class="shrink-0">{{ key }}</code>
                  <span class="text-gray-600 dark:text-gray-400">{{ desc }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-xs text-gray-500">No options</div>
          </div>
        </div>
      </template>
      <template #footer="{ close }">
        <UButton label="Close" color="neutral" variant="outline" @click="close" />
      </template>
    </UModal>

    <!-- Share -->
    <div class="mt-4 flex items-center gap-2">
      <UButton icon="i-mdi-shuffle" color="neutral" variant="outline" @click="onRandomExample">Random</UButton>
      <UButton icon="i-mdi-share-variant" @click="onShare">Share</UButton>
    </div>
    <div v-if="shareContent" class="mt-2">
      <ShareUrl :url="shareContent.url" @close="shareContent = undefined" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { puter } from '@heyputer/puter.js';
import JSON5 from 'json5';
import { parsePipeline } from '~/components/pipes/parser';
import { executePipeline } from '~/components/pipes/executor';
import { pipeList, getOptionsDescription } from '~/components/pipes/pipe-list';
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

function getDefaultOptions(pipe: (typeof pipeList)[number]): string {
  if (!pipe.optionsSchema) return '';
  const result = pipe.optionsSchema.safeParse({});
  if (!result.success) return '';
  const keys = Object.keys(result.data as Record<string, unknown>);
  if (keys.length === 0) return '';
  return JSON5.stringify(result.data);
}

const copiedPipe = ref<string | null>(null);
let copyTimer: ReturnType<typeof setTimeout>;

function onCopyPipe(pipe: (typeof pipeList)[number]) {
  const opts = getDefaultOptions(pipe);
  const text = opts ? `|> ${pipe.meta.name}(${opts})` : `|> ${pipe.meta.name}`;
  navigator.clipboard.writeText(text);
  clearTimeout(copyTimer);
  copiedPipe.value = pipe.meta.name;
  copyTimer = setTimeout(() => { copiedPipe.value = null; }, 2000);
}

function onCopyOutput() {
  if (state.output) {
    navigator.clipboard.writeText(state.output);
  }
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

const showHelp = ref(false);

const examples = [
  { input: 'key: value\nnested:\n  inner: 42\nlist:\n  - a\n  - b', pipeline: '|> toJson({ fromFormat: \'yaml\' })\n|> formatJson({ indent: 2 })' },
  { input: 'name = "John"\nage = 30\nactive = true', pipeline: '|> toJson({ fromFormat: \'toml\' })\n|> jsonGet({ path: \'name\' })' },
  { input: '{"items":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}],"total":2}', pipeline: '|> formatJson({ indent: 2, sortKeys: true })' },
  { input: '{"message":"Hello World","timestamp":1234567890}', pipeline: '|> jsonGet({ path: \'message\' })' },
  { input: '{"name":"parent","children":[{"name":"child1"},{"name":"child2"}]}', pipeline: '|> jsonGet({ path: \'name\' })' },
  { input: 'ssl: true\nhost: "example.com"\nport: 443\n', pipeline: '|> toJson()\n|> formatJson({ indent: 2 })' },
  { input: 'SGVsbG8gV29ybGQ=', pipeline: '|> base64Decode' },
  { input: 'Hello World', pipeline: '|> base64Encode' },
  { input: '{\n  "colors": ["red", "green", "blue"]\n}', pipeline: '|> jsonToJs({ quoteAsNeeded: true })' },
  { input: '{"a":1,"b":{"c":2,"d":3}}', pipeline: '|> formatJson({ indent: 4 })' },
];

function onRandomExample() {
  const example = examples[Math.floor(Math.random() * examples.length)]!;
  state.input = example.input;
  state.pipelineText = example.pipeline;
  execute();
}
const helpSearch = ref('');

const filteredPipes = computed(() => {
  const q = helpSearch.value.toLowerCase();
  if (!q) return pipeList;
  return pipeList.filter(
    (p) =>
      p.meta.name.toLowerCase().includes(q) ||
      p.meta.description.toLowerCase().includes(q),
  );
});
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
