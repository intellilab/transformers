<template>
  <div class="container grid-960">
    <h1>URL Builder</h1>
    <section class="container">
      <div class="columns">
        <div class="column col-9 col-lg-6">
          <div class="columns">
            <div class="column col-7 col-lg-12">
              <div class="form-group">
                <div class="form-label">Yaml config</div>
                <vl-code class="t-code" v-if="mounted" :value="content.config" @ready="onReady" @input="onChange" :options="optionsCodeMirror" />
              </div>
            </div>
            <div class="column col-5 col-lg-12">
              <div class="form-group">
                <div class="form-label">URL</div>
                <textarea class="form-input t-url" ref="result" :value="content.result" @input="onParse" rows="4" />
              </div>
              <div class="form-group">
                <qr-canvas class="qrcode" :options="optionsQR" @beforeUpdate="onBeforeUpdate" @updated="onUpdated"></qr-canvas>
              </div>
              <div class="toast toast-error mt-2" v-if="error" v-text="error" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Label</label>
            <input class="form-input" v-model="content.label" />
          </div>
          <div class="form-group">
            <div class="form-label">Name</div>
            <input class="form-input" v-model="content.name">
          </div>
          <div>
            <button class="btn mr-2 mb-1" @click="onReset">Reset</button>
            <button class="btn mr-2 mb-1" :disabled="!content.config" @click="onSave()">Save</button>
            <button class="btn mr-2 mb-1" :disabled="!content.config" @click="onSave(1)">Save as New</button>
            <button class="btn mr-2 mb-1" :disabled="!content.config" @click="onShare">Share</button>
          </div>
          <div v-if="shareContent">
            <input class="form-input" readonly :value="shareContent.url" @click="onSelectAll" />
          </div>
        </div>
        <div class="column col-3 col-lg-6 mt-2 d-flex flex-column">
          <div>Snapshots</div>
          <snapshots
            ref="snapshots"
            :active-index="activeIndex"
            storage-key="url-builder/snapshots"
            @pick="onPick"
            @update="onUpdateIndex"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import QrCanvas from 'qrcanvas-vue';
import yaml from 'js-yaml';
import { debounce, getStorage } from '~/components/utils';
import Snapshots from '~/components/snapshots';

const optionsCodeMirror = {
  mode: 'yaml',
};
const store = getStorage('url-builder/settings');
const settings = store.load({});

export default {
  components: {
    VlCode: () => import('~/components/vl-code'),
    Snapshots,
    QrCanvas,
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
      const item = {
        name: this.content.name || 'No name',
        data: Object.assign({}, this.content, {
          result: undefined,
        }),
      };
      this.activeIndex = this.$refs.snapshots.update(item, asNew ? -1 : this.activeIndex);
    },
    onShare() {
      const { origin, pathname, search } = window.location;
      const query = {
        name: this.content.name,
        label: this.content.label,
        result: this.content.result,
      };
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
      if (settings.version === VERSION) return;
      settings.version = VERSION;
      store.dump(settings);
      // const [{ default: Driver }] = await Promise.all([
      //   import('driver.js'),
      //   import('driver.js/dist/driver.min.css'),
      // ]);
      // const driver = new Driver();
      // driver.defineSteps([{
      //   element: this.$refs.share,
      //   popover: {
      //     title: 'Share your QRCode with others',
      //   },
      // }, {
      //   element: this.$refs.snapshots.$el,
      //   popover: {
      //     title: 'Save your snapshots',
      //     description: 'You can sort them with drag and drop now.',
      //     position: 'left',
      //   },
      // }]);
      // driver.start();
    },
  },
  created() {
    this.onReset();
  },
  mounted() {
    this.mounted = true;
    const query = new URLSearchParams(window.location.hash.slice(1));
    const content = {
      name: query.get('name'),
      label: query.get('label'),
      result: query.get('result'),
    };
    if (content.result) {
      this.content = {
        ...this.content,
        ...content,
      };
      this.onParse();
      window.location.hash = '';
    }
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
    const path = config.path || config.p || '';
    const query = config.query || config.q;
    const search = buildData(query);
    return search ? `${path}?${search}` : path;
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
    const [path, query] = str.split('?');
    const config = {
      _type: 'url',
    };
    if (path) config.path = path;
    if (query) config.query = parseData(query);
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
