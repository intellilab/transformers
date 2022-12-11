<template>
  <div class="tool-string">
    <h1>String Pipes</h1>
    <section class="mb-2">
      <div class="flex">
        <div class="flex-1 mr-4">
          <div class="flex">
            <label>Input</label>
            <a class="ml-4" href="#" v-if="state.input" @click.prevent="onClear">
              <svg viewBox="0 0 20 20" fill="currentColor" class="trash w-6 h-6"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            </a>
          </div>
          <textarea class="form-input" rows="18" v-model="state.input"></textarea>
        </div>
        <div class="flex-1">
          <label>Output</label>
          <textarea class="form-input" rows="18" readonly :value="state.output"></textarea>
        </div>
      </div>
    </section>
    <PipeSection :pipeList="pipeList" :errorPipe="state.errorPipe" v-model="state.pipes" />
    <div class="mt-4">
      <button class="mr-2 mb-1" @click="onShare">Share</button>
    </div>
    <div v-if="shareContent">
      <input class="form-input" readonly :value="shareContent.url" @click="onSelectAll" />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';

const pipeList = ref<IPipe[]>([]);
loadPipes();

async function loadPipes() {
  const pipes = await Promise.all(Object.values(import.meta.glob('~/components/string/pipes/*.js')).map(async req => {
    const pipe: IPipe = await req();
    return pipe;
  }));
  pipeList.value = pipes;
}
</script>

<script setup lang="ts">
import PipeSection from '~/components/pipe-section.vue';
import type { IPipe, IPipeValue } from '~/types';

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
  let errorPipe: string;
  try {
    let data = state.input;
    for (const { name, options } of state.pipes) {
      const pipe = pipeList.value.find(pipe => pipe.meta.name === name);
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
  .map(([key, value]) => value && [key, value].map(encodeURIComponent).join('='))
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
    const pipes = JSON.parse(query.get('p'));
    if (input && pipes) {
      state.input = input;
      state.pipes = pipes;
    }
  } finally {
    window.location.hash = '';
  }
})
</script>
