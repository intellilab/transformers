<template>
  <div class="flex flex-col min-w-36">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">{{ title }}</h3>
      <UButton
        icon="i-mdi-cog"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="onConfig"
      />
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
          <form
            v-if="state.renameIndex === item.index"
            class="flex items-center gap-1 pl-3 pr-1 py-1"
            ref="renameForm"
            @submit.prevent="onRenameSave"
            @keydown.escape="onRenameCancel"
          >
            <UIcon
              name="i-mdi-file-document-outline"
              class="size-4 shrink-0 text-muted"
            />
            <UInput class="flex-1 min-w-0" v-model="state.renameName" />
            <UButton
              type="submit"
              icon="i-mdi-check"
              size="xs"
              variant="ghost"
            />
            <UButton
              icon="i-mdi-close"
              size="xs"
              variant="ghost"
              @click="onRenameCancel"
            />
          </form>
          <button
            v-else
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
            v-if="state.renameIndex !== item.index"
            class="absolute right-0 top-0 bottom-0 flex items-center px-1 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
            :class="
              modelValue === item.index
                ? 'bg-[color-mix(in_srgb,var(--ui-primary)_10%,var(--ui-bg))]'
                : 'bg-elevated'
            "
          >
            <UButton
              icon="i-mdi-pencil"
              variant="ghost"
              color="secondary"
              size="sm"
              @click="onRename(item.index, item.data.name)"
            />
            <UTooltip
              v-if="state.deleteConfirmIndex === item.index"
              text="Click again to delete"
              :delay="0"
              default-open
            >
              <UButton
                icon="i-mdi-delete"
                variant="solid"
                color="error"
                size="sm"
                @click="onDelete(item.index)"
              />
            </UTooltip>
            <UButton
              v-else
              icon="i-mdi-delete"
              variant="ghost"
              color="secondary"
              size="sm"
              @click="onDelete(item.index)"
            />
          </div>
        </div>
      </div>
    </div>

    <UModal v-model:open="state.modalOpen" title="Snapshots Config">
      <template #body>
        <UTextarea :rows="10" v-model="state.modalContent" class="w-full" />
        <p
          v-if="state.modalMessage"
          class="mt-2 text-sm"
          :class="state.modalError ? 'text-error' : 'text-success'"
        >
          {{ state.modalMessage }}
        </p>
      </template>
      <template #footer>
        <CopyButton :text="state.modalContent" />
        <div class="ml-auto flex gap-2">
          <UButton
            label="Overwrite"
            color="error"
            variant="solid"
            @click="overwriteData"
          />
          <UButton
            label="Append"
            color="neutral"
            variant="outline"
            @click="appendData"
          />
          <UButton
            label="Close"
            color="neutral"
            variant="outline"
            @click="state.modalOpen = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';
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
  modalContent: string;
  modalMessage: string;
  modalError: boolean;
  renameIndex: number;
  renameName: string;
  deleteConfirmIndex: number;
  deleteTimer?: number;
}>({
  search: '',
  modalOpen: false,
  modalContent: '',
  modalMessage: '',
  modalError: false,
  renameIndex: -1,
  renameName: '',
  deleteConfirmIndex: -1,
});

const renameForm = ref<HTMLFormElement[]>();

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

function onConfig() {
  state.modalContent = JSON.stringify(props.snapshots.all);
  state.modalMessage = '';
  state.modalError = false;
  state.modalOpen = true;
}

function overwriteData() {
  try {
    const data = JSON.parse(state.modalContent);
    if (!Array.isArray(data)) throw new Error('Invalid data.');
    props.snapshots.update(() => data);
    state.modalMessage = 'Snapshots overwritten successfully.';
    state.modalError = false;
  } catch (err) {
    state.modalError = true;
    state.modalMessage = `${err}`;
    console.error(err);
  }
}

function appendData() {
  try {
    const data = JSON.parse(state.modalContent);
    if (!Array.isArray(data)) throw new Error('Invalid data.');
    props.snapshots.update((prev) => [...prev, ...data]);
    state.modalMessage = 'Data appended successfully.';
    state.modalError = false;
  } catch (err) {
    state.modalError = true;
    state.modalMessage = `${err}`;
    console.error(err);
  }
}

function onPick({ index, data }: { index: number; data: ISnapshot }) {
  clearDeleteTimer();
  emit('update:modelValue', index === props.modelValue ? -1 : index);
  emit('pick', data, index);
}

function clearDeleteTimer() {
  clearTimeout(state.deleteTimer);
  state.deleteConfirmIndex = -1;
}

function onRename(index: number, currentName: string) {
  clearDeleteTimer();
  state.renameIndex = index;
  state.renameName = currentName || '';
  nextTick(() => {
    renameForm.value?.[0]?.querySelector('input')?.focus();
  });
}

function onRenameSave() {
  if (state.renameIndex < 0) return;
  const item = props.snapshots.all[state.renameIndex];
  if (!item) return;
  props.snapshots.updateItem(state.renameIndex, {
    name: state.renameName || 'Unnamed',
    data: item.data,
  });
  state.renameIndex = -1;
}

function onRenameCancel() {
  state.renameIndex = -1;
}

function onDelete(index: number) {
  if (state.deleteConfirmIndex === index) {
    clearDeleteTimer();
    props.snapshots.remove(index);
    if (index === props.modelValue) index = -1;
    else if (index < props.modelValue) index = props.modelValue - 1;
    else return;
    emit('update:modelValue', index);
  } else {
    clearDeleteTimer();
    state.deleteConfirmIndex = index;
    state.deleteTimer = window.setTimeout(() => {
      state.deleteConfirmIndex = -1;
    }, 2000);
  }
}
</script>
