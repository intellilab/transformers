<template>
  <div class="size-full flex flex-col">
    <h1 class="text-3xl mb-4">String Pipes</h1>
    <div
      class="flex-1 grid grid-cols-[2fr_1fr_1fr] grid-rows-[auto_auto] gap-4 *:min-w-0"
    >
      <div>
        <div class="flex items-center mb-1">
          <span class="font-bold">Input</span>
          <UButton
            v-if="content.input"
            icon="i-mdi-delete"
            size="xs"
            color="neutral"
            variant="ghost"
            class="ml-1"
            @click="
              content.input = '';
              execute();
            "
          />
        </div>
        <CodeEditor
          class="h-[300px] border border-default"
          v-model="content.input"
          @input="onInputChange"
          placeholder="Enter input data..."
        />
      </div>
      <div>
        <div class="flex items-center mb-1">
          <span class="font-bold">Pipes</span>
          <UButton
            icon="i-mdi-help-circle-outline"
            size="xs"
            color="neutral"
            variant="ghost"
            class="ml-1"
            @click="showHelp = true"
          />
          <UButton
            icon="i-mdi-shuffle"
            color="neutral"
            variant="outline"
            size="xs"
            class="ml-auto"
            @click="onRandomExample"
          >
            Random
          </UButton>
        </div>
        <UTextarea
          class="block"
          :class="state.pipelineError ? 'border-error' : ''"
          v-model="content.pipelineText"
          placeholder="# Example pipeline
|> toJson({ fromFormat: 'yaml' })
|> formatJson({ indent: 2 })"
          @input="execute"
          :rows="8"
        />
        <div v-if="state.pipelineError" class="text-error text-xs mt-1">
          {{ state.pipelineError }}
        </div>
      </div>
      <SnapshotPanel
        class="row-span-3"
        title="Snapshots"
        v-model="state.activeIndex"
        :snapshots="snapshots"
        @pick="onPick"
      />
      <div>
        <div class="flex items-center mb-1">
          <span class="font-bold">Output</span>
          <CopyButton
            :text="state.output"
            size="xs"
            variant="ghost"
            class="ml-auto"
          />
        </div>
        <CodeEditor
          class="h-[200px] border border-default"
          readonly
          :modelValue="state.output"
          placeholder="Output will appear here..."
        />
      </div>
      <div>
        <form @submit.prevent="onGenerate">
          <div class="font-bold mb-1">AI Prompt</div>
          <UTextarea
            class="block"
            v-model="state.prompt"
            placeholder="e.g. convert YAML to JSON"
            size="lg"
            :rows="4"
          />
          <div class="flex justify-end mt-1">
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
      </div>
      <div class="col-span-2 space-y-2">
        <div class="flex gap-2">
          <UButton
            icon="i-mdi-content-save"
            :disabled="!content.input"
            @click="onSave()"
            >Save</UButton
          >
          <UButton
            icon="i-mdi-content-save-outline"
            color="neutral"
            variant="outline"
            :disabled="!content.input"
            @click="onSave(true)"
            >Save as New</UButton
          >
          <UButton
            icon="i-mdi-undo"
            color="neutral"
            variant="outline"
            @click="onReset()"
            >Reset</UButton
          >
          <UButton
            icon="i-mdi-share-variant"
            color="neutral"
            variant="outline"
            :disabled="!content.input"
            @click="onShare"
            >Share</UButton
          >
        </div>
        <div v-if="shareContent">
          <ShareUrl :url="shareContent.url" @close="shareContent = undefined" />
        </div>
      </div>
    </div>

    <UModal v-model:open="showHelp" title="Available Pipes" class="max-w-2xl">
      <template #body>
        <UInput
          v-model="helpSearch"
          type="search"
          placeholder="Search pipes..."
          icon="i-mdi-magnify"
          class="block mb-4"
          size="sm"
        />
        <div class="space-y-4 text-sm h-96 overflow-y-auto">
          <div
            v-if="filteredPipes.length === 0"
            class="text-gray-500 text-center py-8"
          >
            No pipes found
          </div>
          <div
            v-for="pipe in filteredPipes"
            :key="pipe.meta.name"
            class="border border-default rounded p-3"
          >
            <div class="font-bold text-base mb-1 flex items-center gap-2">
              <span>|> {{ pipe.meta.name }}</span>
              <CopyButton
                :text="getPipeCopyText(pipe)"
                size="xs"
                variant="ghost"
                class="shrink-0"
              />
            </div>
            <div class="text-gray-600 dark:text-gray-400 mb-2">
              {{ pipe.meta.description }}
            </div>
            <div v-if="pipe.optionsSchema">
              <div
                class="font-semibold text-xs uppercase tracking-wide mb-1 text-gray-500"
              >
                Options
              </div>
              <div class="space-y-1">
                <div
                  v-for="(desc, key) in getOptionsDescription(pipe)"
                  :key="key"
                  class="flex gap-2"
                >
                  <code class="shrink-0">{{ key }}</code>
                  <span class="text-gray-600 dark:text-gray-400">{{
                    desc
                  }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-xs text-gray-500">No options</div>
          </div>
        </div>
      </template>
      <template #footer="{ close }">
        <UButton
          label="Close"
          color="neutral"
          variant="outline"
          @click="close"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { puter } from '@heyputer/puter.js';
import JSON5 from 'json5';
import { KeyboardService } from '@violentmonkey/shortcut';
import { parsePipeline } from '~/components/pipes/parser';
import { executePipeline } from '~/components/pipes/executor';
import { pipeList, getOptionsDescription } from '~/components/pipes/pipe-list';
import { generatePipeline } from '~/components/pipes/ai';
import SnapshotPanel from '@/components/snapshot-panel.vue';
import CopyButton from '@/components/copy-button.vue';
import { Snapshots, Storage } from '@/util';
import CodeEditor from '~/components/code-editor.vue';

const toast = useToast();
const keyboardService = new KeyboardService();
const store = new Storage<{
  autoSaved?: {
    input: string;
    pipelineText: string;
    activeIndex: number;
  };
}>('string-pipes/settings');
const settings = store.load({});
const snapshots = new Snapshots('string-pipes/snapshots');

const content = reactive<{
  input: string;
  pipelineText: string;
}>({
  input: '',
  pipelineText: '',
});

const state = reactive<{
  output: string;
  pipelineError: string;
  prompt: string;
  activeIndex: number;
}>({
  output: '',
  pipelineError: '',
  prompt: '',
  activeIndex: -1,
});

const shareContent = ref<{ url: string }>();
const showHelp = ref(false);
const helpSearch = ref('');
const generating = ref(false);

function getPipeCopyText(pipe: (typeof pipeList)[number]): string {
  const opts = getDefaultOptions(pipe);
  return opts ? `|> ${pipe.meta.name}(${opts})` : `|> ${pipe.meta.name}`;
}

function execute() {
  const parsed = parsePipeline(content.pipelineText, pipeList);
  state.pipelineError = parsed.errors[0]?.message || '';
  if (parsed.errors.length > 0) return;
  const result = executePipeline(
    content.input,
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

function onShare() {
  const { origin, pathname, search } = window.location;
  const query = {
    i: content.input,
    p: content.pipelineText,
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

const examples = [
  {
    input: 'key: value\nnested:\n  inner: 42\nlist:\n  - a\n  - b',
    pipeline: "|> toJson({ fromFormat: 'yaml' })\n|> formatJson({ indent: 2 })",
  },
  {
    input: 'name = "John"\nage = 30\nactive = true',
    pipeline: "|> toJson({ fromFormat: 'toml' })\n|> jsonGet({ path: 'name' })",
  },
  {
    input:
      '{"items":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}],"total":2}',
    pipeline: '|> formatJson({ indent: 2, sortKeys: true })',
  },
  {
    input: '{"message":"Hello World","timestamp":1234567890}',
    pipeline: "|> jsonGet({ path: 'message' })",
  },
  {
    input: '{"name":"parent","children":[{"name":"child1"},{"name":"child2"}]}',
    pipeline: "|> jsonGet({ path: 'name' })",
  },
  {
    input: 'ssl: true\nhost: "example.com"\nport: 443\n',
    pipeline: '|> toJson()\n|> formatJson({ indent: 2 })',
  },
  { input: 'SGVsbG8gV29ybGQ=', pipeline: '|> base64Decode' },
  { input: 'Hello World', pipeline: '|> base64Encode' },
  {
    input: '{\n  "colors": ["red", "green", "blue"]\n}',
    pipeline: '|> jsonToJs({ quoteAsNeeded: true })',
  },
  {
    input: '{"a":1,"b":{"c":2,"d":3}}',
    pipeline: '|> formatJson({ indent: 4 })',
  },
];

function onRandomExample() {
  const example = examples[Math.floor(Math.random() * examples.length)]!;
  content.input = example.input;
  content.pipelineText = example.pipeline;
  execute();
}

const filteredPipes = computed(() => {
  const q = helpSearch.value.toLowerCase();
  if (!q) return pipeList;
  return pipeList.filter(
    (p) =>
      p.meta.name.toLowerCase().includes(q) ||
      p.meta.description.toLowerCase().includes(q),
  );
});

async function onGenerate() {
  if (!state.prompt.trim() || generating.value) return;
  if (!puter.auth.isSignedIn()) {
    await puter.auth.signIn({ attempt_temp_user_creation: true });
  }
  generating.value = true;
  try {
    const result = await generatePipeline(state.prompt, content.pipelineText);
    if (result) {
      content.pipelineText = result;
      execute();
    }
    state.prompt = '';
  } catch (err: unknown) {
    toast.add({
      title: 'Generation failed',
      description: err instanceof Error ? err.message : JSON.stringify(err),
      color: 'error',
      duration: 5000,
    });
  } finally {
    generating.value = false;
  }
}

function onSave(asNew?: boolean) {
  const item = {
    data: { input: content.input, pipelineText: content.pipelineText },
  };
  state.activeIndex = snapshots.updateItem(
    asNew ? -1 : state.activeIndex,
    item,
  );
  toast.add({ title: 'Saved', duration: 2000 });
}

function onPick({ data }: { data: { input: string; pipelineText: string } }) {
  content.input = data.input;
  content.pipelineText = data.pipelineText;
  execute();
}

function onReset(data?: { input: string; pipelineText: string }) {
  state.activeIndex = -1;
  content.input = data?.input || '';
  content.pipelineText = data?.pipelineText || '';
  state.output = '';
  state.pipelineError = '';
}

function saveData() {
  const { input, pipelineText } = content;
  settings.autoSaved = { input, pipelineText, activeIndex: state.activeIndex };
  store.dump(settings);
}

function restoreData() {
  const autoSaved = settings.autoSaved;
  if (autoSaved) {
    content.input = autoSaved.input;
    content.pipelineText = autoSaved.pipelineText;
    state.activeIndex = autoSaved.activeIndex ?? -1;
    execute();
  }
}

function checkHash() {
  const query = new URLSearchParams(window.location.hash.slice(1));
  try {
    const input = query.get('i');
    const pipelineText = query.get('p') || '';
    if (input != null) {
      content.input = input;
      content.pipelineText = pipelineText;
      execute();
      state.activeIndex = -1;
    }
  } finally {
    window.location.hash = '';
  }
}

watch(
  () => [content.input, content.pipelineText],
  () => {
    shareContent.value = undefined;
    saveData();
  },
);

const disposeList: Array<() => void> = [];
onMounted(() => {
  keyboardService.enable();
  disposeList.push(keyboardService.register('ctrlcmd-s', () => onSave()));
  restoreData();
});

onUnmounted(() => {
  disposeList.forEach((dispose) => dispose());
});

onMounted(() => {
  checkHash();
});
</script>
