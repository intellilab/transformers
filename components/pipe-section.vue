<template>
  <section>
    <div class="flex mb-2">
      <h3>Applied pipes</h3>
      <a class="ml-4" href="#" v-if="appliedPipes.length" @click.prevent="onClearPipes">
        <svg viewBox="0 0 20 20" fill="currentColor" class="trash w-6 h-6"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
      </a>
    </div>
    <div>
      <div class="tool-string-pipe mr-2 disabled">Input</div>
      <template v-for="(item, index) in appliedPipes" :key="index">
        <span class="mr-2">&rarr;</span>
        <div class="tool-string-pipe mr-2 mb-2" :class="{'bg-red-300': item.name === errorPipe}" @click="onEditStart(item)">
          <div class="flex">
            <strong v-text="item.name" class="flex-1 mr-2"></strong>
            <a href="#" @click.prevent.stop="onRemovePipe(index)">
              <svg viewBox="0 0 20 20" fill="currentColor" class="x w-6 h-6"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
          </div>
          <span class="text-xs" v-text="reprOptions(item.options)"></span>
        </div>
      </template>
      <span class="mr-2">&rarr;</span>
      <div class="tool-string-pipe disabled">Output</div>
    </div>
    <h3 class="mt-2 mb-1">Pipes</h3>
    <div class="mb-2">
      <input type="search" class="form-input" placeholder="Filter pipes..." v-model="state.search">
    </div>
    <button
      v-for="(pipe, index) in filteredPipes"
      :key="index"
      class="mr-2 mb-2"
      v-text="pipe.meta.name"
      @click="addPipe(pipe)"
    />
    <p class="text-gray" v-if="!filteredPipes.length">No pipe is found.</p>
    <VlModal v-if="state.editing" show @close="onEditEnd">
      <div class="modal-content">
        <div class="font-bold mb-2" v-text="state.editing.pipe.meta.name"></div>
        <div class="text-left" v-if="state.editing.pipe.meta.options.length">
          <div v-for="(option, index) in state.editing.pipe.meta.options" :key="index" class="mb-2">
            <div v-if="option.type === 'checkbox'">
              <label class="block">
                <input type="checkbox" v-model="state.editing.options[option.name]">
                <span v-text="option.description"></span>
              </label>
            </div>
            <div v-else>
              <label class="block" v-text="option.description"></label>
              <div v-if="option.type === 'radio'">
                <label v-for="(choice, index) in option.choices" class="block" :key="index">
                  <input type="radio" :value="choice.value" v-model="state.editing.options[option.name]">
                  <span v-text="choice.label"></span>
                </label>
              </div>
              <input v-else-if="option.type === 'number'" class="form-input" type="number" v-model.number="state.editing.options[option.name]">
              <input v-else class="form-input" v-model="state.editing.options[option.name]">
            </div>
          </div>
        </div>
        <div class="empty" v-else>
          <div class="empty-title">No options available</div>
        </div>
      </div>
    </VlModal>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import VlModal from '~/components/vl-modal';

interface PipeValue {
  name: string;
  options: Record<string, unknown>;
  normalizedOptions: Record<string, unknown>;
}

interface PipeInfo {
  meta: {
    name: string;
    options: Array<{
      type: 'input' | 'checkbox' | 'radio' | 'number';
      name: string;
      description: string;
      default?: unknown;
      choices?: Array<{ label: string; value: string }>;
      normalize?: (input: unknown) => unknown;
    }>;
  };
}

const props = defineProps<{
  pipeList: PipeInfo[];
  errorPipe?: string;
  modelValue: PipeValue[];
}>();
const emits = defineEmits<{
  (event: 'update:modelValue', value: PipeValue[]): void;
}>();

const state = reactive<{
  search: string;
  editing?: {
    pipe: PipeInfo;
    value: PipeValue;
    options: Record<string, unknown>;
  };
}>({
  search: '',
});

const appliedPipes = ref<PipeValue[]>([]);
watch(() => props.modelValue, (value: PipeValue[]) => {
  appliedPipes.value = value;
});

const filteredPipes = computed(() => {
  let pipes = props.pipeList;
  const search = state.search.toLowerCase();
  if (search) {
    pipes = pipes.filter(pipe => pipe.meta.name.toLowerCase().includes(search));
  }
  return pipes;
});

function addPipe(pipe: PipeInfo) {
  const { options, normalizedOptions } = pipe.meta.options.reduce((res, item) => {
    if (item.default != null) {
      let value = item.default;
      res.options[item.name] = value;
      if (item.normalize) value = item.normalize(value);
      res.normalizedOptions[item.name] = value;
    }
    return res;
  }, {
    options: {} as Record<string, unknown>,
    normalizedOptions: {} as Record<string, unknown>,
  });
  emits('update:modelValue', [
    ...props.modelValue,
    {
      name: pipe.meta.name,
      options,
      normalizedOptions,
    }
  ]);
}

function reprOptions(options: Record<string, unknown>) {
  const repr = Object.keys(options)
  .map(key => `${key}=${options[key]}`)
  .join(';');
  return repr ? `[${repr}]` : '';
}

function onRemovePipe(index: number) {
  emits('update:modelValue', [
    ...props.modelValue.slice(0, index),
    ...props.modelValue.slice(index + 1),
  ]);
}

function onClearPipes() {
  emits('update:modelValue', []);
}

function onEditStart(value: PipeValue) {
  const pipe = props.pipeList.find(pipe => pipe.meta.name === value.name);
  state.editing = {
    pipe,
    value,
    options: { ...value.options },
  };
}

function onEditEnd() {
  state.editing.value.options = state.editing.options;
  state.editing.value.normalizedOptions = state.editing.pipe.meta.options.reduce((res, item) => {
    let value = state.editing.options[item.name];
    if (value != null && item.normalize) value = item.normalize(value);
    res[item.name] = value;
    return res;
  }, {} as Record<string, unknown>);
  state.editing = null;
  emits('update:modelValue', [...props.modelValue]);
}
</script>
