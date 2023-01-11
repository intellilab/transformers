<template>
  <div>
    <h1>URL Builder</h1>
    <section>
      <div class="flex items-start">
        <div class="flex-1 min-w-0">
          <div class="flex">
            <div class="flex-1 min-w-0 mr-4">
              <div>
                <div class="mb-1">
                  Parsed data
                  <span class="ml-1 text-sm">(in Yaml)</span>
                </div>
                <VlCode class="t-code" :modelValue="content.config" @update:modelValue="setConfig" @ready="checkHash" :options="optionsCodeMirror" />
              </div>
            </div>
            <div class="flex-1 mr-4">
              <div>
                <div class="mb-1">
                  URL
                  <span class="ml-1 text-sm">(Special protocols like <code>otpauth:</code>, <code>vmess:</code> are supported)</span>
                </div>
                <textarea class="form-input" :value="content.url" @input="onUrlChange" rows="4" />
                <TotpBanner v-if="state.totp" :data="state.totp" />
              </div>
              <div class="mt-4">
                <QRCanvas class="qrcode" :width="300" :height="content.label ? 340 : 300" :options="optionsQR" @updated="onQRUpdated" />
              </div>
              <div class="mt-2 text-white error" v-if="state.error" v-text="state.error" />
            </div>
          </div>
          <div class="mt-4 mr-4">
            <label class="mb-1">Label</label>
            <input class="form-input" v-model="content.label" />
          </div>
          <div class="mt-4 mr-4">
            <label class="mb-1">Name</label>
            <input class="form-input" v-model="content.name">
          </div>
          <div class="mt-4">
            <button class="mr-2 mb-1" @click="onReset">Reset</button>
            <button class="mr-2 mb-1" :disabled="!content.config" @click="onSave()">Save</button>
            <button class="mr-2 mb-1" :disabled="!content.config" @click="onSave(true)">Save as New</button>
            <button class="mr-2 mb-1" :disabled="!content.config" @click="onShare">Share</button>
          </div>
          <div v-if="shareContent">
            <input class="form-input" readonly :value="shareContent.url" @click="onSelectAll" />
          </div>
        </div>
        <SnapshotPanel
          title="Snapshots"
          v-model="state.activeIndex"
          :snapshots="snapshots"
          @pick="onPick"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { QRCanvas } from 'qrcanvas-vue';
import yaml from 'js-yaml';
import { KeyboardService } from '@violentmonkey/shortcut';
import SnapshotPanel from '~/components/snapshot-panel.vue';
import { parseData, buildData } from '~/components/url';
import TotpBanner from '~/components/totp-banner.vue';
import { showToast } from '~/components/toast';
import { VlCode, defaultOptions } from '~/components/vl-code';
import { defaultQROptions } from '~/components/common';
import { Snapshots, Storage } from '~/util';

/**
 * Left panel: config -> parsedConfig
 * Right panel: url -> QRCode
 *
 * change: config -> parsedConfig
 *                -> url -> QRCode
 * change: url -> QRCode
 *             -> config -> parsedConfig
 */

const keyboardService = new KeyboardService();
const optionsCodeMirror = computed(() => ({
  ...defaultOptions,
  mode: 'yaml',
}));
const store = new Storage('url-builder/settings');
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
  totp?: Record<string, unknown>;
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
  shareContent.value = null;
});

const disposeList: Array<() => void> = [];
onMounted(() => {
  keyboardService.enable();
  disposeList.push(keyboardService.register('ctrlcmd-s', () => onSave()));
});

onUnmounted(() => {
  disposeList.forEach(dispose => dispose());
});

function onQRUpdated(canvas: HTMLCanvasElement) {
  const { label } = content;
  if (label) {
    const context = canvas.getContext('2d');
    context.clearRect(0, 300, 300, 40);
    context.font = '24px -apple-system, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
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
  state.activeIndex = snapshots.updateItem(asNew ? -1 : state.activeIndex, item);
  showToast('Saved');
}

function checkHash() {
  const query = new URLSearchParams(window.location.hash.slice(1));
  const data = {
    name: query.get('name'),
    label: query.get('label'),
    url: query.get('url'),
  };
  if (data.url) {
    state.activeIndex = -1;
    Object.assign(content, data);
    window.location.hash = '';
  }
}

function saveData() {
  const { name, label, config } = content;
  settings.autoSaved = {
    name, label, config,
    activeIndex: state.activeIndex,
  };
  store.dump(settings);
}

function setConfig(data: string) {
  if (updatingConfig || data === content.config) return;
  updatingConfig = true;
  content.config = data;

  let parsedConfig: Record<string, any>;
  try {
    state.error = null;
    parsedConfig = data && yaml.load(data);
  } catch (err) {
    state.error = `${err}`;
    console.error(err);
  }

  // TOTP
  if (parsedConfig?.payload?.type === 'totp' && parsedConfig.query?.secret) {
    state.totp = {
      ...parsedConfig.payload,
      ...parsedConfig.query,
    };
  } else {
    state.totp = null;
  }

  saveData();
  if (!updatingUrl) {
    setUrl(parsedConfig && buildData(parsedConfig) || '');
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
  const { name, label, url } = this.content;
  const query = { name, label, url };
  let qs = Object.entries(query)
  .map(([key, value]) => value && [key, value].map(encodeURIComponent).join('='))
  .filter(Boolean)
  .join('&');
  qs = `${qs}&_=`; // in case url is modified by other apps
  const shareUrl = `${origin}${pathname}${search}#${qs}`;
  shareContent.value = {
    url: shareUrl,
  };
}

function onPick({ data }) {
  Object.assign(content, {
    name: data.name,
    label: data.label,
  });
  setConfig(data.config);
}

function onReset() {
  state.activeIndex = -1;
  Object.assign(content, {
    name: '',
    label: '',
    config: '',
    url: '',
  });
}

function onSelectAll(e: MouseEvent) {
  (e.target as HTMLInputElement).select();
}
</script>
