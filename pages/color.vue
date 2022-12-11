<template>
  <div>
    <h1>Color Pipes</h1>
    <section class="flex mb-2">
      <div class="flex-1 mr-4">
        <label>Input</label>
        <div class="flex">
          <input class="form-input flex-1" v-model="state.input" :class="{ 'bg-red-300': state.inputError }">
          <div class="w-8 h-8 ml-2 border border-gray-400" :style="renderBg(state.input)"></div>
        </div>
      </div>
      <div class="flex-1">
        <label>Output</label>
        <div class="flex items-center" v-for="(item, key) in state.output" :key="key">
          <div class="w-16 text-gray-600" v-text="key"></div>
          <input class="form-input flex-1" readonly :value="item" @click="$event.target.select()">
          <div class="w-8 h-8 ml-2 border border-gray-400" :style="{ background: item }"></div>
        </div>
      </div>
    </section>
    <PipeSection :pipeList="pipeList" :errorPipe="state.errorPipe" v-model="state.pipes" />
  </div>
</template>

<script lang="ts">
import { reactive, ref, watch } from 'vue';
import type { IPipe, IPipeValue } from '~/types';

const pipeList = ref<IPipe[]>([]);
loadPipes();

async function loadPipes() {
  const pipes = await Promise.all(Object.values(import.meta.glob('~/components/color/pipes/*.(ts|js)')).map(async req => {
    const pipe: IPipe = await req();
    return pipe;
  }));
  pipeList.value = pipes;
}
</script>

<script setup lang="ts">
import PipeSection from '~/components/pipe-section';
import { parseColor, reprHex, reprRgba, reprHsla } from '~/components/color/util';

const state = reactive<{
  input: string;
  inputColor?: string;
  inputError?: string;
  error?: string;
  errorPipe?: string;
  output: ReturnType<typeof normalizeOutput>;
  pipes: IPipeValue[];
}>({
  input: '',
  output: {
    Hex: '',
    RGBA: '',
    HSLA: '',
  },
  pipes: [],
});

watch(() => state.input, (input: string) => {
  try {
    state.inputColor = input && parseColor(input);
    state.inputError = null;
  } catch (error) {
    state.inputColor = null;
    state.inputError = error;
  }
});

watch(() => [pipeList.value, state.pipes, state.inputColor], () => {
  let errorPipe: string;
  try {
    let data = state.inputColor;
    for (const { name, options } of state.pipes) {
      const pipe = pipeList.value.find(pipe => pipe.meta.name === name);
      if (pipe) {
        errorPipe = name;
        data = pipe.handle(data, options);
      }
    }
    state.output = normalizeOutput(data);
    state.errorPipe = '';
  } catch (error) {
    state.error = error;
    state.errorPipe = errorPipe;
  }
});

function renderBg(color: string) {
  try {
    const normalized = reprHex(parseColor(color));
    return `background-color: ${normalized}`;
  } catch {
    return null;
  }
}

function normalizeOutput(color: string) {
  return {
    Hex: color && reprHex(color),
    RGBA: color && reprRgba(color),
    HSLA: color && reprHsla(color),
  };
}
</script>
