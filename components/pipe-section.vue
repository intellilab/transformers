<template>
  <section>
    <div class="flex mb-2">
      <h3>Applied pipes</h3>
      <a
        class="ml-4"
        href="#"
        v-if="appliedPipes.length"
        @click.prevent="onClearPipes"
      >
        <UIcon name="i-mdi-delete" class="size-6" />
      </a>
    </div>
    <div class="flex flex-wrap items-start gap-2">
      <div class="inline-block px-2 py-1 rounded border border-muted text-dimmed align-top">Input</div>
      <template v-for="(item, index) in appliedPipes" :key="index">
        <span class="py-1">&rarr;</span>
        <div
          class="inline-block px-2 py-1 rounded border border-default align-top cursor-pointer"
          :class="{ 'bg-error/30': item.name === errorPipe }"
          @click="onEditStart(item)"
        >
          <div class="flex">
            <strong v-text="item.name" class="flex-1 mr-2"></strong>
            <a href="#" @click.prevent.stop="onRemovePipe(index)">
              <UIcon name="i-mdi-close" class="size-6" />
            </a>
          </div>
          <span class="text-xs" v-text="reprOptions(item.options)"></span>
        </div>
      </template>
      <span class="py-1">&rarr;</span>
      <div class="inline-block px-2 py-1 rounded border border-muted text-dimmed align-top">Output</div>
    </div>
    <h3 class="mt-2 mb-1">Pipes</h3>
    <div class="mb-2">
      <UInput
        icon="i-lucide-search"
        placeholder="Filter pipes..."
        v-model="state.search"
      />
    </div>
    <UButton
      v-for="(pipe, index) in filteredPipes"
      :key="index"
      variant="outline"
      class="mr-2 mb-2"
      v-text="pipe.meta.name"
      @click="addPipe(pipe)"
    />
    <p class="text-muted" v-if="!filteredPipes.length">No pipe is found.</p>

    <UModal v-model:open="modalOpen" :title="state.editing?.pipe.meta.name">
      <template #body>
        <div class="text-left space-y-4" v-if="state.editing?.pipe.meta.options.length">
          <div
            v-for="(option, index) in state.editing.pipe.meta.options"
            :key="index"
          >
            <div v-if="option.type === 'checkbox'">
              <UCheckbox
                :label="option.description"
                v-model="state.editing.options[option.name]"
              />
            </div>
            <div v-else>
              <label class="block mb-1 text-sm text-muted" v-text="option.description"></label>
              <URadioGroup
                v-if="option.type === 'radio'"
                v-model="state.editing.options[option.name]"
                :items="option.choices?.map(c => ({ label: c.label, value: c.value }))"
              />
              <UInput
                v-else-if="option.type === 'number'"
                type="number"
                v-model.number="state.editing.options[option.name]"
              />
              <UInput
                v-else
                v-model="state.editing.options[option.name]"
              />
            </div>
          </div>
        </div>
        <p v-else class="text-muted">No options available</p>
      </template>
      <template #footer="{ close }">
        <UButton label="Done" @click="onEditEnd" />
      </template>
    </UModal>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

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

const modalOpen = ref(false);

const appliedPipes = ref<PipeValue[]>([]);
watch(
  () => props.modelValue,
  (value: PipeValue[]) => {
    appliedPipes.value = value;
  }
);

const filteredPipes = computed(() => {
  let pipes = props.pipeList;
  const search = state.search.toLowerCase();
  if (search) {
    pipes = pipes.filter((pipe) =>
      pipe.meta.name.toLowerCase().includes(search)
    );
  }
  return pipes;
});

function addPipe(pipe: PipeInfo) {
  const { options, normalizedOptions } = pipe.meta.options.reduce(
    (res, item) => {
      if (item.default != null) {
        let value = item.default;
        res.options[item.name] = value;
        if (item.normalize) value = item.normalize(value);
        res.normalizedOptions[item.name] = value;
      }
      return res;
    },
    {
      options: {} as Record<string, unknown>,
      normalizedOptions: {} as Record<string, unknown>,
    }
  );
  emits('update:modelValue', [
    ...props.modelValue,
    {
      name: pipe.meta.name,
      options,
      normalizedOptions,
    },
  ]);
}

function reprOptions(options: Record<string, unknown>) {
  const repr = Object.keys(options)
    .map((key) => `${key}=${options[key]}`)
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
  const pipe = props.pipeList.find((pipe) => pipe.meta.name === value.name);
  state.editing = {
    pipe,
    value,
    options: { ...value.options },
  };
  modalOpen.value = true;
}

function onEditEnd() {
  state.editing.value.options = state.editing.options;
  state.editing.value.normalizedOptions =
    state.editing.pipe.meta.options.reduce((res, item) => {
      let value = state.editing.options[item.name];
      if (value != null && item.normalize) value = item.normalize(value);
      res[item.name] = value;
      return res;
    }, {} as Record<string, unknown>);
  state.editing = null;
  modalOpen.value = false;
  emits('update:modelValue', [...props.modelValue]);
}
</script>
