<template>
  <div class="container grid-960">
    <h1>URL Builder</h1>
    <section class="container">
      <div class="columns">
        <div class="column col-5">
          <div class="form-group">
            <div class="form-label">Yaml config</div>
            <vl-code class="t-code" v-if="mounted" :value="content.config" @input="onUpdate" :options="optionsCodeMirror" />
          </div>
          <div class="form-group">
            <label class="form-label">Label (shown on QRCode)</label>
            <input class="form-input" v-model="content.label" />
          </div>
          <div class="form-group">
            <div class="form-label">Name</div>
            <input class="form-input" v-model="content.name">
          </div>
          <div>
            <button class="btn mr-2 mb-1" @click="onReset">Reset</button>
            <button class="btn mr-2 mb-1" :disabled="!content.config" @click="onSave()">Save as bookmark</button>
            <button class="btn mr-2 mb-1" :disabled="!content.config" @click="onSave(1)">Save as new bookmark</button>
          </div>
        </div>
        <div class="column col-4">
          <div class="form-group">
            <div class="form-label">URL</div>
            <textarea class="form-input t-url" :value="content.result" @input="onParse" rows="4" />
          </div>
          <div class="form-group">
            <qr-canvas :options="optionsQR"></qr-canvas>
          </div>
          <div class="toast toast-error mt-2" v-if="error" v-text="error" />
        </div>
        <bookmarks
          ref="bookmarks"
          class="column col-3 mt-2 d-flex flex-column"
          :active="active"
          storage-key="url-builder/bookmarks"
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
import Bookmarks from '~/components/bookmarks';

const optionsCodeMirror = {
  mode: 'yaml',
};

export default {
  components: {
    VlCode: () => import('~/components/vl-code'),
    Bookmarks,
    QrCanvas,
  },
  data() {
    return {
      content: {},
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
      const { result, label } = this.content;
      const logo = label && {
        text: label,
        clearEdges: 3,
      };
      this.optionsQR = {
        cellSize: 4,
        data: result,
        logo,
      };
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
    onUpdate: debounce(function update(data) {
      if (data === this.cachedData) return;
      this.cachedData = data;
      this.content.config = data;
      try {
        const config = yaml.safeLoad(data);
        this.content.result = buildData(config);
        this.error = null;
      } catch (err) {
        this.error = err.toString();
        console.error(err);
      }
    }, 300),
    onParse: debounce(function onParse(e) {
      const { value } = e.target;
      this.content.result = value;
      const config = parseData(value);
      this.cachedData = yaml.safeDump(config);
      this.content.config = this.cachedData;
    }, 300),
    onPick(item, index) {
      this.active = item;
      this.activeIndex = index;
      this.content = {
        name: item.name,
        label: item.label,
        config: item.data.config,
        result: '',
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
      this.active = this.$refs.bookmarks.update(item, asNew ? -1 : this.activeIndex);
    },
  },
  created() {
    this.onReset();
  },
  mounted() {
    this.mounted = true;
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
      if (!value) return;
      return `${encodeURIComponent(key)}=${encodeURIComponent(buildData(value))}`;
    }).filter(Boolean).join('&');
  }
  return config.data == null ? '' : config.data;
}

function parseData(str) {
  if (/:\/\/|\?/.test(str)) {
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
  if (/,/.test(str)) {
    return str.split(',').map(decodeURIComponent).map(parseData);
  }
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
