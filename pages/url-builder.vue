<template>
  <div class="container grid-960">
    <h1>URL Builder</h1>
    <section class="container">
      <div class="columns">
        <div class="column col-5">
          <div class="form-group">
            <div class="form-label">Yaml config</div>
            <vl-code class="t-code" v-if="mounted" :value="content.config" @input="onChange" :options="optionsCodeMirror" />
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
        <div class="column col-4">
          <div class="form-group">
            <div class="form-label">URL</div>
            <textarea class="form-input t-url" ref="result" :value="content.result" @input="onParse" rows="4" />
          </div>
          <div class="form-group">
            <qr-canvas :options="optionsQR" @beforeUpdate="onBeforeUpdate" @updated="onUpdated"></qr-canvas>
          </div>
          <div class="toast toast-error mt-2" v-if="error" v-text="error" />
        </div>
        <snapshots
          ref="snapshots"
          class="column col-3 mt-2 d-flex flex-column"
          :active="active"
          storage-key="url-builder/snapshots"
          @pick="onPick"
        />
      </div>
    </section>
  </div>
</template>

<script>
import QrCanvas from 'qrcanvas-vue';
import yaml from 'js-yaml';
import { debounce } from '~/components/utils';
import Snapshots from '~/components/snapshots';

const optionsCodeMirror = {
  mode: 'yaml',
};

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
      active: null,
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
      this.active = null;
      this.content = {
        name: null,
        label: null,
        config: '',
        result: null,
      };
    },
    onChange: debounce(function onChange(data) {
      if (data === this.cachedData) return;
      this.cachedData = data;
      this.content.config = data;
      this.onUpdate();
    }, 300),
    onParse: debounce(function onParse() {
      const { value } = this.$refs.result;
      this.content.result = value;
      const config = parseData(value);
      this.cachedData = yaml.safeDump(config);
      this.content.config = this.cachedData;
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
    onPick(item) {
      this.active = this.active === item ? null : item;
      this.content = {
        name: item.data.name,
        label: item.data.label,
        config: item.data.config,
        result: this.content.result,
      };
      this.onUpdate();
    },
    onSave(asNew) {
      const item = {
        name: this.content.name || 'No name',
        data: Object.assign({}, this.content, {
          result: undefined,
        }),
      };
      this.active = this.$refs.snapshots.update(item, !asNew && this.active);
    },
    onShare() {
      const { origin, pathname } = window.location;
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
      const url = `${origin}${pathname}#${qs}`;
      this.shareContent = {
        url,
      };
    },
    onSelectAll(e) {
      e.target.select();
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
  if (/[&=]/.test(str)) {
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
</style>
