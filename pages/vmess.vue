<template>
  <div>
    <h1>VMess URL Editor</h1>
    <section>
      <div class="flex items-start">
        <div class="flex-1 min-w-0 mr-4">
          <div class="mb-1">VMess URLs</div>
          <vl-code class="t-code" :value="urlContent.value" @ready="onContentReady" :options="optionsContent" />
        </div>
        <div class="flex-1 min-w-0 mr-4">
          <div class="mb-1">Detail</div>
          <vl-code class="t-code" :value="urlDetail.value" @input="onDetailChange" :options="optionsDetail" />
        </div>
        <div>
          <QRCanvas class="qrcode" width="300" :height="300" :options="optionsQR" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import yaml from 'js-yaml';
import { QRCanvas } from 'qrcanvas-vue';
import tracker from '~/components/tracker';
import { debounce } from '~/components/utils';

const optionsContent = {
  mode: null,
  styleActiveLine: true,
};
const optionsDetail = {
  mode: 'yaml',
};
const VMESS = 'vmess://';

export default {
  mixins: [tracker],
  components: {
    VlCode: () => import('~/components/vl-code'),
    QRCanvas,
  },
  data() {
    return {
      optionsContent,
      optionsDetail,
      optionsQR: null,
      urlContent: {
        value: '',
      },
      urlDetail: {
        value: '',
      },
    };
  },
  methods: {
    setCurrent() {
      const cm = this.cmContent;
      const { line } = cm.getCursor();
      const url = cm.getLine(line).trim();
      if (line === this.urlDetail.line && url === this.urlDetail.url) return;
      let value = '';
      try {
        if (url.startsWith(VMESS)) {
          value = yaml.dump(JSON.parse(atob(url.slice(VMESS.length))));
        }
      } catch {
        // noop
      }
      this.urlDetail = {
        line,
        url,
        value,
      };
      this.optionsQR = {
        data: url,
      };
    },
    updateCurrent(value) {
      let url;
      if (value) {
        try {
          url = VMESS + btoa(JSON.stringify(yaml.load(value)));
        } catch {
          // noop
        }
      }
      const cm = this.cmContent;
      const { line } = cm.getCursor();
      if (url && line === this.urlDetail.line && url !== this.urlDetail.url) {
        this.urlDetail.url = url;
        cm.replaceRange(`${url}\n`, { line, ch: 0 }, { line: line + 1, ch: 0 });
        cm.setCursor({ line, ch: 0 });
      }
    },
    onContentReady(cm) {
      this.cmContent = cm;
      cm.on('cursorActivity', this.setCurrent);
      cm.on('changes', this.setCurrent);
    },
    onDetailChange(value) {
      this.updateCurrent(value);
    },
  },
  created() {
    this.setCurrent = debounce(this.setCurrent, 200);
    this.updateCurrent = debounce(this.updateCurrent, 200);
  },
};
</script>
