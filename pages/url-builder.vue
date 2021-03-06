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
                <vl-code class="t-code" :value="content.config" @ready="onReady" @input="onConfigInput" :options="optionsCodeMirror" />
              </div>
            </div>
            <div class="flex-1 mr-4">
              <div>
                <div class="mb-1">
                  URL
                  <span class="ml-1 text-sm">(Special protocols like <code>otpauth:</code>, <code>vmess:</code> are supported)</span>
                </div>
                <textarea class="form-input" ref="url" :value="content.url" @input="onUrlInput" rows="4" />
                <TOTP v-if="totp" :data="totp" />
              </div>
              <div class="mt-4">
                <QRCanvas class="qrcode" width="300" :height="content.label ? 340 : 300" :options="optionsQR" @updated="onUpdated" />
              </div>
              <div class="mt-2 bg-red-500 text-white" v-if="error" v-text="error" />
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
            <button class="mr-2 mb-1" :disabled="!content.config" @click="onSave(1)">Save as New</button>
            <button class="mr-2 mb-1" :disabled="!content.config" @click="onShare">Share</button>
          </div>
          <div v-if="shareContent">
            <input class="form-input" readonly :value="shareContent.url" @click="onSelectAll" />
          </div>
        </div>
        <snapshots
          ref="snapshots"
          title="Snapshots"
          :active-index="activeIndex"
          storage-key="url-builder/snapshots"
          @pick="onPick"
          @update="onUpdateIndex"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { QRCanvas } from 'qrcanvas-vue';
import yaml from 'js-yaml';
import { KeyboardService } from '@violentmonkey/shortcut';
import { debounce, getStorage } from '~/components/utils';
import Snapshots from '~/components/snapshots';
import tracker from '~/components/tracker';
import { parseData, buildData } from '~/components/url';
import TOTP from '~/components/totp';

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
const optionsCodeMirror = {
  mode: 'yaml',
};
const store = getStorage('url-builder/settings');
const settings = store.load({});

export default {
  mixins: [tracker],
  components: {
    VlCode: () => import('~/components/vl-code'),
    Snapshots,
    QRCanvas,
    TOTP,
  },
  data() {
    return {
      content: {},
      shareContent: null,
      activeIndex: null,
      error: null,
      optionsCodeMirror,
      optionsQR: null,
      totp: null,
    };
  },
  watch: {
    'content.url': 'updateQR',
    'content.label': 'updateQR',
  },
  methods: {
    updateQR() {
      const { url } = this.content;
      this.optionsQR = {
        data: url,
      };
      this.shareContent = null;
    },
    onUpdated(canvas) {
      const { label } = this.content;
      if (label) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 300, 300, 40);
        context.font = '24px -apple-system, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
        context.fillStyle = 'dodgerblue';
        context.textAlign = 'center';
        context.fillText(label, 150, 330);
      }
    },
    onReset() {
      this.activeIndex = -1;
      this.content = {
        name: null,
        label: null,
        config: '',
        url: null,
      };
    },
    saveData() {
      const {
        content: {
          name, label, config,
        },
        activeIndex,
      } = this;
      settings.autoSaved = {
        name, label, config, activeIndex,
      };
      store.dump(settings);
    },
    setConfig(data, update = true) {
      if (this.cachedData === data) return;
      this.cachedData = data;
      this.content.config = data;

      let parsedConfig;
      try {
        this.error = null;
        parsedConfig = data && yaml.load(data);
      } catch (err) {
        this.error = err.toString();
        console.error(err);
      }

      // TOTP
      if (parsedConfig?.payload?.type === 'totp' && parsedConfig.query?.secret) {
        this.totp = {
          ...parsedConfig.payload,
          ...parsedConfig.query,
        };
      } else {
        this.totp = null;
      }

      this.saveData();

      // need update URL if the config is changed directly
      if (update) this.updateUrl(parsedConfig);
    },
    onConfigInput: debounce(function onConfigInput(data) {
      this.setConfig(data);
    }, 300),
    onUrlInput: debounce(function onUrlInput() {
      const { value } = this.$refs.url;
      this.content.url = value;
      const config = parseData(value);
      this.setConfig(yaml.dump(config), false);
    }, 300),
    updateUrl(parsedConfig) {
      this.content.url = parsedConfig && buildData(parsedConfig);
    },
    loadData({ name, label, config, activeIndex }) {
      this.content = {
        name,
        label,
        config,
        url: this.content.url,
      };
      if (activeIndex != null) this.activeIndex = activeIndex;
    },
    onPick(index) {
      this.activeIndex = this.activeIndex === index ? -1 : index;
      const item = this.$refs.snapshots.get(this.activeIndex);
      if (item) this.loadData(item.data);
    },
    onUpdateIndex(index) {
      this.activeIndex = index;
    },
    onSave(asNew) {
      const { name, label, config } = this.content;
      const item = {
        name: name || 'No name',
        data: { name, label, config },
      };
      this.activeIndex = this.$refs.snapshots.update(item, asNew ? -1 : this.activeIndex);
      this.showToast('Saved');
    },
    onShare() {
      const { origin, pathname, search } = window.location;
      const { name, label, url } = this.content;
      const query = { name, label, url };
      let qs = Object.entries(query)
      .map(([key, value]) => value && [key, value].map(encodeURIComponent).join('='))
      .filter(Boolean)
      .join('&');
      qs = `${qs}&_=`; // in case url is modified by other apps
      const shareUrl = `${origin}${pathname}${search}#${qs}`;
      this.shareContent = {
        url: shareUrl,
      };
    },
    onSelectAll(e) {
      e.target.select();
    },
    async onReady() {
      const VERSION = '20180930';
      if (settings.autoSaved) this.loadData(settings.autoSaved);
      this.checkHash();
      if (settings.version === VERSION) return;
      settings.version = VERSION;
      store.dump(settings);
    },
    checkHash() {
      const query = new URLSearchParams(window.location.hash.slice(1));
      const content = {
        name: query.get('name'),
        label: query.get('label'),
        url: query.get('url'),
      };
      if (content.url) {
        this.activeIndex = -1;
        this.content = {
          ...this.content,
          ...content,
        };
        this.onUrlInput();
        window.location.hash = '';
      }
    },
  },
  created() {
    this.onReset();
  },
  mounted() {
    keyboardService.enable();
    this.disposeList = [
      keyboardService.register('ctrlcmd-s', e => {
        e.preventDefault();
        this.onSave();
      }),
    ];
  },
  beforeDestroy() {
    keyboardService.disable();
    this.disposeList?.forEach(dispose => dispose());
  },
  errorCaptured(err, vm, info) {
    this.trackError(err, {
      message: 'qrcode',
      c3: JSON.stringify({
        config: this.content.config,
        info,
      }),
    });
  },
};
</script>

<style>
.t-code {
  border: 1px solid #caced7;
  > .CodeMirror {
    height: 400px;
  }
}

.t-url {
  word-break: break-all;
}

.qrcode {
  max-width: 100%;
}
</style>
