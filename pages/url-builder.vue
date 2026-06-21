<template>
  <div>
    <h1 class="text-3xl mb-4">URL Builder</h1>
    <div
      class="grid grid-cols-[1.5fr_1.5fr_1fr] grid-rows-[auto_auto] gap-4 min-w-[800px] items-start"
    >
      <div>
        <div class="mb-1">
          Parsed data
          <span class="ml-1 text-sm">(in Yaml)</span>
        </div>
        <CodeEditor
          class="h-[400px] border border-default"
          lang="yaml"
          v-model="content.config"
        />
      </div>
      <div>
        <div class="mb-1">
          URL
          <span class="ml-1 text-sm"
            >(Special protocols like
            <code class="bg-accented rounded px-1">otpauth:</code>
            are supported)</span
          >
        </div>
        <UTextarea
          class="block"
          :value="content.url"
          @input="onUrlChange"
          :rows="4"
        />
        <TotpBanner v-if="state.totp" :data="state.totp" />
        <div class="mt-4">
          <QRCanvas
            class="dark:brightness-50 max-w-full"
            :width="300"
            :height="content.label ? 340 : 300"
            :options="optionsQR"
            @updated="onQRUpdated"
          />
        </div>
        <div
          class="mt-2 rounded p-2 bg-error text-inverted"
          v-if="state.error"
          v-text="state.error"
        />
      </div>
      <SnapshotPanel
        class="row-span-3"
        title="Snapshots"
        v-model="state.activeIndex"
        :snapshots="snapshots"
        @pick="onPick"
      />
      <div class="flex items-start gap-2">
        <div class="py-1">Name</div>
        <div class="flex-1">
          <UInput class="block" v-model="content.name" />
          <div class="text-xs">(show in the list)</div>
        </div>
      </div>
      <div class="flex items-start gap-2">
        <div class="py-1">Label</div>
        <div class="flex-1">
          <UInput class="block" v-model="content.label" />
          <div class="text-xs">(show on the QRCode)</div>
        </div>
      </div>
      <div class="col-span-2 space-y-2">
        <div class="flex gap-2">
          <UButton
            icon="i-mdi-content-save"
            :disabled="!content.config"
            @click="onSave()"
            >Save</UButton
          >
          <UButton
            icon="i-mdi-content-save-outline"
            color="neutral"
            variant="outline"
            :disabled="!content.config"
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
            :disabled="!content.config"
            @click="onShare"
            >Share</UButton
          >
        </div>
        <div v-if="shareContent">
          <ShareUrl :url="shareContent.url" @close="shareContent = undefined" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { QRCanvas } from 'qrcanvas-vue';
import yaml from 'js-yaml';
import { KeyboardService } from '@violentmonkey/shortcut';
import SnapshotPanel from '@/components/snapshot-panel.vue';
import { parseData, buildData } from '@/components/url';
import TotpBanner from '@/components/totp-banner.vue';
import CodeEditor from '~/components/code-editor.vue';
import { defaultQROptions } from '@/components/common';
import { Snapshots, Storage } from '@/util';

interface IConfigItem {
  name: string;
  label: string;
  config: string;
}

const toast = useToast();
const keyboardService = new KeyboardService();
const store = new Storage<{
  autoSaved?: IConfigItem & {
    activeIndex: number;
  };
}>('url-builder/settings');
const settings = store.load({});
const snapshots = new Snapshots('url-builder/snapshots');

const content = reactive<{
  config: string;
  url: string;
  label: string;
  name: string;
}>({
  config: '',
  url: '',
  label: '',
  name: '',
});
const state = reactive<{
  activeIndex: number;
  error?: string;
  totp?: Record<string, any>;
}>({
  activeIndex: -1,
});
const optionsQR = computed(() => ({
  ...defaultQROptions,
  data: content.url,
}));
const shareContent = ref<{ url: string }>();
let updatingConfig = false;
let updatingUrl = false;

watch(optionsQR, () => {
  shareContent.value = undefined;
});

const disposeList: Array<() => void> = [];
onMounted(() => {
  keyboardService.enable();
  disposeList.push(keyboardService.register('ctrlcmd-s', () => onSave()));
  restoreData();
});

onUnmounted(() => {
  disposeList.forEach((dispose) => dispose());
});

function onQRUpdated(canvas: HTMLCanvasElement) {
  const { label } = content;
  if (label) {
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 300, 300, 40);
    context.font =
      '24px -apple-system, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
    context.fillStyle = 'dodgerblue';
    context.textAlign = 'center';
    context.fillText(label, 150, 330);
  }
}

function onSave(asNew?: boolean) {
  const { name, label, config } = content;
  const item = {
    name: name || 'No name',
    data: { name, label, config },
  };
  state.activeIndex = snapshots.updateItem(
    asNew ? -1 : state.activeIndex,
    item,
  );
  toast.add({ title: 'Saved', duration: 2000 });
}

function checkHash() {
  const query = new URLSearchParams(window.location.hash.slice(1));
  const data = {
    name: query.get('name') || '',
    label: query.get('label') || '',
    url: query.get('url'),
  };
  if (data.url) {
    state.activeIndex = -1;
    Object.assign(content, data);
    setUrl(data.url);
    window.location.hash = '';
  }
}

function saveData() {
  const { name, label, config } = content;
  settings.autoSaved = {
    name,
    label,
    config,
    activeIndex: state.activeIndex,
  };
  store.dump(settings);
}

function restoreData() {
  const autoSaved = settings.autoSaved;
  onReset(autoSaved);
  state.activeIndex = autoSaved?.activeIndex ?? -1;
}

function setConfig(data: string, force = false) {
  if (updatingConfig || (data === content.config && !force)) return;
  updatingConfig = true;
  content.config = data;

  let parsedConfig: Record<string, any> | undefined;
  try {
    state.error = undefined;
    parsedConfig = data ? (yaml.load(data) as Record<string, any>) : undefined;
  } catch (err) {
    state.error = `${err}`;
    console.error(err);
  }

  if (parsedConfig?.payload?.type === 'totp' && parsedConfig.query?.secret) {
    state.totp = {
      ...parsedConfig.payload,
      ...parsedConfig.query,
    };
  } else {
    state.totp = undefined;
  }

  saveData();
  if (!updatingUrl) {
    setUrl((parsedConfig && buildData(parsedConfig)) || '');
  }
  updatingConfig = false;
}

function setUrl(data: string) {
  if (updatingUrl) return;
  updatingUrl = true;
  content.url = data;
  if (!updatingConfig) {
    const config = parseData(data);
    setConfig(yaml.dump(config));
  }
  updatingUrl = false;
}

function onUrlChange(e: Event) {
  setUrl((e.target as HTMLTextAreaElement).value);
}

function onShare() {
  const { origin, pathname, search } = window.location;
  const { name, label, url } = content;
  const query = { name, label, url };
  let qs = Object.entries(query)
    .map(
      ([key, value]) => value && [key, value].map(encodeURIComponent).join('='),
    )
    .filter(Boolean)
    .join('&');
  qs = `${qs}&_=`; // in case url is modified by other apps
  const shareUrl = `${origin}${pathname}${search}#${qs}`;
  shareContent.value = {
    url: shareUrl,
  };
}

function onPick({
  data,
}: {
  data: { name: string; label: string; config?: any };
}) {
  Object.assign(content, {
    name: data.name,
    label: data.label,
  });
  setConfig(data.config);
}

function onReset(data?: IConfigItem) {
  state.activeIndex = -1;
  Object.assign(content, {
    name: data?.name || '',
    label: data?.label || '',
  });
  setConfig(data?.config || '', true);
}

onMounted(() => {
  checkHash();
});
</script>
