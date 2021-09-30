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
      <div class="mt-4">
        <button class="mr-2 mb-1" @click="onClientConfig">Get client config</button>
        <button class="mr-2 mb-1" @click="onServerConfig">Get server config</button>
      </div>
    </section>
    <vl-modal v-if="modal" visible @close="modal = null">
      <div class="modal-content mx-auto flex flex-col" style="height: 80vh">
        <div class="mb-2" v-text="modal.title"></div>
        <textarea class="flex-1 border border-gray-400" readonly :value="modal.value" @click="$event.target.select()"></textarea>
      </div>
    </vl-modal>
  </div>
</template>

<script>
import yaml from 'js-yaml';
import { QRCanvas } from 'qrcanvas-vue';
import tracker from '~/components/tracker';
import { debounce } from '~/components/utils';
import { loadVMess, dumpVMess } from '~/components/url';
import VlModal from '~/components/vl-modal';

const optionsContent = {
  mode: null,
  styleActiveLine: true,
};
const optionsDetail = {
  mode: 'yaml',
};
const getClientConfig = data => ({
  log: {
    loglevel: 'error',
  },
  inbounds: [
    {
      tag: 'socks-in',
      port: 1080,
      listen: '::',
      protocol: 'socks',
      settings: {
        auth: 'noauth',
        udp: true,
        ip: '127.0.0.1',
      },
    },
    {
      tag: 'http-in',
      port: 1086,
      listen: '::',
      protocol: 'http',
    },
  ],
  outbounds: [
    {
      protocol: 'vmess',
      settings: {
        vnext: [
          {
            address: data.add,
            port: data.port,
            users: [
              {
                email: 'user@v2ray.com',
                id: data.id,
                alterId: data.aid,
                security: 'auto',
              },
            ],
          },
        ],
      },
      streamSettings: {
        network: data.net,
        ...data.net === 'ws' ? {
          wsSettings: {
            connectionReuse: true,
            path: data.path,
            headers: {
                Host: data.host,
            },
          },
        } : {},
        ...data.tls === 'tls' ? {
          security: 'tls',
          tlsSettings: {
            allowInsecure: true,
            serverName: data.host,
          },
        } : {},
      },
      mux: {
        enabled: true,
      },
      tag: 'proxy',
    },
    {
      protocol: 'freedom',
      tag: 'direct',
      settings: {
        domainStrategy: 'UseIP',
      },
    },
    {
      protocol: 'blackhole',
      tag: 'blocked',
      settings: {},
    },
  ],
  routing: {
    domainStrategy: 'IPOnDemand',
    rules: [
      {
        type: 'field',
        outboundTag: 'direct',
        domain: [
          'geosite:cn',
        ],
      },
      {
        type: 'field',
        ip: [
          'geoip:cn',
          'geoip:private',
        ],
        outboundTag: 'direct',
      },
      {
        type: 'field',
        domain: [
          'geosite:category-ads',
        ],
        outboundTag: 'blocked',
      },
    ],
  },
  dns: {
    hosts: {
      'domain:v2ray.com': 'www.vicemc.net',
      'domain:github.io': 'pages.github.com',
      'domain:wikipedia.org': 'www.wikimedia.org',
      'domain:shadowsocks.org': 'electronicsrealm.com',
    },
    servers: [
      {
        address: '114.114.114.114',
        port: 53,
        domains: [
          'geosite:cn',
        ],
        tcp: true,
      },
      'localhost',
    ],
  },
});
const getServerConfig = data => ({
  inbounds: [
    {
      tag: 'socks-in',
      port: data.port || 10010,
      listen: '::',
      protocol: 'vmess',
      settings: {
        clients: [
          {
            id: data.id,
            level: 0,
            alterId: data.aid,
          },
        ],
      },
      streamSettings: {
        network: data.net || '',
        ...data.net === 'ws' ? {
          wsSettings: {
            path: data.path,
            headers: {
              Host: data.host,
            },
          },
        } : {},
      },
    },
  ],
  outbounds: [
    {
      protocol: 'freedom',
    },
    {
      protocol: 'blackhole',
      tag: 'blocked',
    },
  ],
  routing: {
    rules: [
      {
        type: 'field',
        ip: [
          'geoip:private',
        ],
        outboundTag: 'blocked',
      },
    ],
  },
});

export default {
  mixins: [tracker],
  components: {
    VlCode: () => import('~/components/vl-code'),
    VlModal,
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
      modal: null,
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
        const data = loadVMess(new URL(url));
        value = yaml.dump(data);
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
      if (value === this.urlDetail.value) return;
      let url;
      if (value) {
        try {
          url = dumpVMess(yaml.load(value)).toString();
        } catch {
          // noop
        }
      }
      const cm = this.cmContent;
      const { line } = cm.getCursor();
      if (url && line === this.urlDetail.line && url !== this.urlDetail.url) {
        this.urlDetail.url = url;
        this.urlDetail.value = value;
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
    onClientConfig() {
      if (!this.urlDetail.value) return;
      try {
        const data = yaml.load(this.urlDetail.value);
        const prefix = '// ' + this.urlDetail.url + '\n\n';
        this.modal = {
          title: 'Client config',
          value: prefix + JSON.stringify(getClientConfig(data), null, 2),
        };
      } catch {
        // noop
      }
    },
    onServerConfig() {
      if (!this.urlDetail.value) return;
      try {
        const data = yaml.load(this.urlDetail.value);
        const prefix = '// ' + this.urlDetail.url + '\n\n';
        this.modal = {
          title: 'Server config',
          value: prefix + JSON.stringify(getServerConfig(data), null, 2),
        };
      } catch {
        // noop
      }
    },
  },
  created() {
    this.setCurrent = debounce(this.setCurrent, 200);
    this.updateCurrent = debounce(this.updateCurrent, 200);
  },
};
</script>
