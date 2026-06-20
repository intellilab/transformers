<template>
  <div>
    <h1 class="text-3xl">String Pipes</h1>
    <section class="mb-2">
      <div class="flex">
        <div class="flex-1 mr-4">
          <div class="flex">
            <label>Input</label>
            <a
              class="ml-4"
              href="#"
              v-if="state.input"
              @click.prevent="onClear"
            >
              <UIcon name="i-mdi-delete" class="w-5 h-5" />
            </a>
          </div>
          <textarea
            class="block p-1 w-full bg-transparent border border-default font-mono resize-none"
            rows="18"
            v-model="state.input"
          ></textarea>
        </div>
        <div class="flex-1">
          <label>Output</label>
          <textarea
            class="block p-1 w-full bg-transparent border border-default font-mono resize-none"
            rows="18"
            readonly
            :value="state.output"
          ></textarea>
        </div>
      </div>
    </section>
    <PipeSection
      :pipeList="pipeList"
      :errorPipe="state.errorPipe"
      v-model="state.pipes"
    />
    <div class="mt-4">
      <UButton class="mr-2 mb-1" @click="onShare">Share</UButton>
    </div>
    <div v-if="shareContent">
      <UInput
        readonly
        :value="shareContent.url"
        @click="onSelectAll"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';

const pipeList = ref<IPipe[]>([]);
loadPipes();

async function loadPipes() {
  const pipes = await Promise.all(
    Object.values(import.meta.glob('~/components/string/pipes/*.js')).map(
      async (req) => {
        const pipe: IPipe = await req();
        return pipe;
      }
    )
  );
  pipeList.value = pipes;
}
</script>

<script setup lang="ts">
import PipeSection from '~/components/pipe-section.vue';

const state = reactive<{
  input: string;
  output?: string;
  errorPipe?: string;
  pipes: IPipeValue[];
}>({
  input: '',
  pipes: [],
});

const shareContent = ref<{ url: string }>();

watch([pipeList.value, () => [state.pipes, state.input]], () => {
  let errorPipe = '';
  try {
    let data = state.input;
    for (const { name, options } of state.pipes) {
      const pipe = pipeList.value.find((pipe) => pipe.meta.name === name);
      if (pipe) {
        errorPipe = name;
        data = pipe.handle(data, options);
      }
    }
    state.output = data;
    state.errorPipe = '';
  } catch (error) {
    state.errorPipe = errorPipe;
  }
});

function onClear() {
  state.input = '';
}

function onSelectAll(e: MouseEvent) {
  (e.target as HTMLInputElement).select();
}

function onShare() {
  const { origin, pathname, search } = window.location;
  const { input, pipes } = state;
  const query = {
    i: input,
    p: JSON.stringify(pipes),
  };
  let qs = Object.entries(query)
    .map(
      ([key, value]) => value && [key, value].map(encodeURIComponent).join('=')
    )
    .filter(Boolean)
    .join('&');
  qs = `${qs}&_=`; // in case url is modified by other apps
  const url = `${origin}${pathname}${search}#${qs}`;
  shareContent.value = {
    url,
  };
}

onMounted(() => {
  const query = new URLSearchParams(window.location.hash.slice(1));
  try {
    const input = query.get('i');
    const pipes = JSON.parse(query.get('p') || '');
    if (input && pipes) {
      state.input = input;
      state.pipes = pipes;
    }
  } finally {
    window.location.hash = '';
  }
});
</script>
