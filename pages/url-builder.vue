<template>
  <div>
    <h1>URL Builder</h1>
    <section>
      <div class="flex items-start">
        <div class="flex-1 min-w-0">
          <div class="flex">
            <div class="flex-1 min-w-0 mr-4">
              <div>
                <div class="mb-1">Yaml config</div>
                <vl-code class="t-code" v-if="mounted" :value="content.config" @ready="onReady" @input="onChange" :options="optionsCodeMirror" />
              </div>
            </div>
            <div class="flex-1 mr-4">
              <div>
                <div class="mb-1">URL</div>
                <textarea class="form-input" ref="result" :value="content.result" @input="onParse" rows="4" />
              </div>
              <div class="mt-4">
                <QRCanvas class="qrcode" :options="optionsQR" @beforeUpdate="onBeforeUpdate" @updated="onUpdated" />
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
import hotkeys from 'hotkeys-js';
import { debounce, getStorage } from '~/components/utils';
import Snapshots from '~/components/snapshots';
import tracker from '~/components/tracker';

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
  },
  data() {
    return {
      content: {},
      shareContent: null,
      activeIndex: null,
      error: null,
      mounted: false,
      optionsCodeMirror,
      optionsQR: null,
    };
  },
  watch: {
    'content.result': 'updateQR',
    'content.label': 'updateQR',
  },
  methods: {
    updateQR() {
      const { result } = this.content;
      this.optionsQR = {
        data: result,
      };
      this.shareContent = null;
    },
    onBeforeUpdate(canvas) {
      const { label } = this.content;
      canvas.width = 300;
      canvas.height = label ? 340 : 300;
    },
    onUpdated(canvas) {
      const { label } = this.content;
      if (label) {
        const context = canvas.getContext('2d');
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
        result: null,
      };
    },
    onAutoSave() {
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
    onChange: debounce(function onChange(data) {
      if (data === this.cachedData) return;
      this.cachedData = data;
      this.content.config = data;
      this.onUpdate();
      this.onAutoSave();
    }, 300),
    onParse: debounce(function onParse() {
      const { value } = this.$refs.result;
      this.content.result = value;
      const config = parseData(value);
      this.cachedData = yaml.safeDump(config);
      this.content.config = this.cachedData;
      this.onAutoSave();
    }, 300),
    onUpdate() {
      try {
        const config = yaml.safeLoad(this.content.config);
        this.content.result = buildData(config);
        this.error = null;
      } catch (err) {
        this.error = err.toString();
        console.error(err);
      }
    },
    loadData({ name, label, config, activeIndex }) {
      this.content = {
        name,
        label,
        config,
        result: this.content.result,
      };
      if (activeIndex != null) this.activeIndex = activeIndex;
      this.onUpdate();
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
      const { name, label, result } = this.content;
      const query = { name, label, result };
      let qs = Object.entries(query)
      .map(([key, value]) => value && [key, value].map(encodeURIComponent).join('='))
      .filter(Boolean)
      .join('&');
      qs = `${qs}&_=`; // in case url is modified by other apps
      const url = `${origin}${pathname}${search}#${qs}`;
      this.shareContent = {
        url,
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
        result: query.get('result'),
      };
      if (content.result) {
        this.activeIndex = -1;
        this.content = {
          ...this.content,
          ...content,
        };
        this.onParse();
        window.location.hash = '';
      }
    },
  },
  created() {
    this.onReset();
    hotkeys.filter = () => true;
    hotkeys('ctrl+s,command+s', (e) => {
      e.preventDefault();
      this.onSave();
    });
  },
  mounted() {
    this.mounted = true;
  },
  beforeDestroy() {
    hotkeys.unbind('ctrl+s,command+s');
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

function buildData(raw) {
  let config;
  if (raw && raw._type) {
    config = raw;
  } else if (!raw || typeof raw !== 'object') {
    config = {
      _type: 'primitive',
      data: raw,
    };
  } else {
    config = {
      _type: 'object',
      data: raw,
    };
  }
  if (config._type === 'url') {
    let url = config.path || config.p || '';
    const search = buildData(config.query || config.q);
    const hash = buildData(config.hash || config.h);
    if (search) url += `?${search}`;
    if (hash) url += `#${hash}`;
    return url;
  }
  if (config._type === 'object' && config.data) {
    const { data } = config;
    if (Array.isArray(data)) return data.map(buildData).map(encodeURIComponent).join(',');
    return Object.keys(config.data).map(key => {
      const value = config.data[key];
      if (value == null) return;
      return `${encodeURIComponent(key)}=${encodeURIComponent(buildData(value))}`;
    }).filter(Boolean).join('&');
  }
  return config.data == null ? '' : config.data;
}

function parseData(str) {
  if (/^[\w-]+:\/\/|\?/.test(str)) {
    const [pathquery, hash] = str.split('#');
    const [path, query] = pathquery.split('?');
    const config = {
      _type: 'url',
    };
    if (path) config.path = path;
    if (query) config.query = parseData(query);
    if (hash) config.hash = parseData(hash);
    return config;
  }
  // Exclude ending `=` since it may be base64
  if (/&|=[^=]/.test(str)) {
    return str.split('&').reduce((res, part) => {
      const [rkey, rval] = part.split('=');
      res[decodeURIComponent(rkey)] = parseData(decodeURIComponent(rval));
      return res;
    }, {});
  }
  // if (/,/.test(str)) {
  //   return str.split(',').map(decodeURIComponent).map(parseData);
  // }
  return decodeURIComponent(str);
}
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
