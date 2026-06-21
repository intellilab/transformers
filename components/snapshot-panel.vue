<template>
  <div class="flex flex-col min-w-36">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">{{ title }}</h3>
      <div class="flex">
        <UButton
          icon="i-mdi-upload"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="onImport"
        />
        <UButton
          icon="i-mdi-download"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="onExport"
        />
      </div>
    </div>
    <div class="flex flex-col flex-1 min-h-0 border border-default rounded-lg">
      <div class="p-2">
        <UInput
          class="block"
          icon="i-mdi-magnify"
          placeholder="Search..."
          v-model="state.search"
        />
      </div>
      <div
        v-if="!filtered.length"
        class="flex-1 flex items-center justify-center text-muted pb-2"
      >
        No snapshots found
      </div>
      <div v-else class="flex-1 overflow-y-auto">
        <div
          v-for="item in filtered"
          :key="item.index"
          class="group relative rounded-lg transition-colors"
          :class="
            modelValue === item.index
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-elevated'
          "
        >
          <button
            class="flex items-center gap-2 w-full text-left px-3 py-2"
            @click="onPick(item)"
          >
            <UIcon
              name="i-mdi-file-document-outline"
              class="size-4 shrink-0 text-muted"
            />
            <span class="flex-1 truncate">{{
              item.data.name || 'Unnamed'
            }}</span>
          </button>
          <div
            class="absolute right-0 top-0 bottom-0 flex items-center px-1 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
            :class="
              modelValue === item.index
                ? 'bg-[color-mix(in_srgb,var(--ui-primary)_10%,var(--ui-bg))]'
                : 'bg-elevated'
            "
          >
            <UButton
              icon="i-mdi-close"
              variant="ghost"
              color="secondary"
              size="sm"
              @click="onRemove(item.index)"
            />
          </div>
        </div>
      </div>
    </div>

    <UModal v-model:open="state.modalOpen" :title="state.modal?.title">
      <template #body>
        <UTextarea
          :rows="10"
          v-model="state.modal!.content"
          :read-only="state.modal?.readOnly"
          @click="onClick"
          class="w-full"
        />
        <p
          v-if="state.modal?.message"
          class="mt-2 text-sm"
          :class="state.modal.error ? 'text-error' : 'text-success'"
        >
          {{ state.modal.message }}
        </p>
      </template>
      <template #footer="{ close }">
        <UButton
          v-if="!state.modal?.readOnly"
          label="Import and merge"
          @click="importData"
        />
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
import { computed, reactive } from 'vue';
import { type ISnapshot, Snapshots } from '@/util';

const props = defineProps<{
  title: string;
  modelValue: number;
  snapshots: Snapshots;
}>();
const emit = defineEmits<{
  (event: 'update:modelValue', index: number): void;
  (event: 'pick', data: any, index: number): void;
}>();

const state = reactive<{
  search: string;
  modalOpen: boolean;
  modal?: {
    title: string;
    content: string;
    message?: string;
    error?: boolean;
    readOnly?: boolean;
  };
}>({
  search: '',
  modalOpen: false,
});

const filtered = computed(() => {
  let items = props.snapshots.all.map((data, index) => ({ data, index }));
  if (state.search) {
    const lowerSearch = state.search.toLowerCase();
    items = items.filter(({ data }) =>
      data.name.toLowerCase().includes(lowerSearch),
    );
  }
  return items;
});

function openModal(config: typeof state.modal) {
  state.modal = config;
  state.modalOpen = true;
}

function onImport() {
  openModal({
    title: 'Import data',
    content: '',
    message: '',
    error: false,
  });
}

function onExport() {
  openModal({
    title: 'Export data',
    content: JSON.stringify(props.snapshots.all),
    readOnly: true,
  });
}

function onClick(e: MouseEvent) {
  if (state.modal?.readOnly) (e.target as HTMLTextAreaElement).select();
}

function importData() {
  if (!state.modal) return;
  try {
    const data = JSON.parse(state.modal.content);
    if (!Array.isArray(data)) throw new Error('Invalid data.');
    props.snapshots.update((prev) => [...prev, ...data]);
    state.modal.message = 'Data imported successfully.';
    state.modal.error = false;
  } catch (err) {
    state.modal.error = true;
    state.modal.message = `${err}`;
    console.error(err);
  }
}

function onPick({ index, data }: { index: number; data: ISnapshot }) {
  emit('update:modelValue', index === props.modelValue ? -1 : index);
  emit('pick', data, index);
}

function onRemove(index: number) {
  props.snapshots.remove(index);
  if (index === props.modelValue) index = -1;
  else if (index < props.modelValue) index = props.modelValue - 1;
  else return;
  emit('update:modelValue', index);
}
</script>
