<template>
  <div class="snapshots">
    <div class="flex mb-1">
      <slot name="title"><span v-text="title"></span></slot>
      <a href="#" class="ml-1 tooltip inline-block" data-tooltip="Import" @click.prevent="onImport">
        <svg viewBox="0 0 20 20" fill="currentColor" class="upload w-6 h-6"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
      </a>
      <a href="#" class="ml-1 tooltip inline-block" data-tooltip="Export" @click.prevent="onExport">
        <svg viewBox="0 0 20 20" fill="currentColor" class="download w-6 h-6"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </a>
    </div>
    <div class="flex flex-col p-2 rounded t-border" style="height:70vh">
      <div class="form-group has-icon-right mb-2">
        <input type="search" class="form-input" v-model="state.search" />
      </div>
      <div class="flex-1 empty" v-if="!filtered.length"><div class="empty-title">None</div></div>
      <div class="flex-1 overflow-y-auto" v-else>
        <div
          class="menu-item"
          :class="{active: modelValue === item.index}"
          v-for="item in filtered"
          :key="item.index">
          <div class="flex-1" v-text="item.data.name" @click.prevent="onPick(item)"></div>
          <a href="#" @click.prevent="onRemove(item.index)">
            <svg viewBox="0 0 20 20" fill="currentColor" class="x w-6 h-6"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </a>
        </div>
      </div>
    </div>
    <VlModal v-if="state.modal" show @close="onClose">
      <div class="modal-content">
        <div class="mb-2" v-text="state.modal.title"></div>
        <div class="mb-2">
          <textarea
            class="form-input"
            rows="10"
            v-model="state.modal.content"
            :readOnly="state.modal.readOnly"
            @click="onClick"
          />
        </div>
        <span
          v-if="state.modal.message"
          class="mr-2"
          :class="state.modal.error ? 'text-error' : 'text-success'"
          v-text="state.modal.message"
        />
        <button v-if="!state.modal.readOnly" class="btn btn-primary" @click="importData">Import and merge</button>
        <button class="btn" @click="onClose">Close</button>
      </div>
    </VlModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import VlModal from '@/components/vl-modal';
import { ISnapshot, Snapshots } from '@/util';

const props = defineProps<{
  title: string;
  modelValue: number;
  snapshots: Snapshots;
}>();
const emits = defineEmits<{
  (event: 'update:modelValue', index: number): void;
  (event: 'pick', data: unknown, index: number): void;
}>();

const state = reactive<{
  search: string;
  snapshots: Array<unknown>;
  modal?: {
    title: string;
    content: string;
    message?: string;
    error?: boolean;
    readOnly?: boolean;
  };
}>({
  search: '',
  snapshots: [],
});

const filtered = computed(() => {
  let items = props.snapshots.all.map((data, index) => ({ data, index }));
  if (state.search) {
    items = items.filter(({ data }) => data.name.includes(state.search));
  }
  return items;
});

function onImport() {
  state.modal = {
    title: 'Import data',
    content: '',
    message: '',
    error: false,
  };
}
function onExport() {
  const content = JSON.stringify(props.snapshots.all);
  state.modal = {
    title: 'Export data',
    content,
    readOnly: true,
  };
}
function onClick(e: MouseEvent) {
  if (state.modal?.readOnly) (e.target as HTMLTextAreaElement).select();
}
function importData() {
  if (!state.modal) return;
  try {
    const data = JSON.parse(state.modal.content);
    if (!Array.isArray(data)) throw new Error('Invalid data.');
    props.snapshots.update(prev => [...prev, ...data]);
    state.modal.message = 'Data imported successfully.';
    state.modal.error = false;
  } catch (err) {
    state.modal.error = true;
    state.modal.message = `${err}`;
    console.error(err);
  }
}

function onPick({ index, data }: { index: number; data: ISnapshot }) {
  emits('update:modelValue', index === props.modelValue ? -1 : index);
  emits('pick', data, index);
}

function onRemove(index: number) {
  props.snapshots.remove(index);
  if (index === props.modelValue) index = -1;
  else if (index < props.modelValue) index = props.modelValue - 1;
  else return;
  emits('update:modelValue', index);
}

function onClose() {
  state.modal = undefined;
}
</script>
