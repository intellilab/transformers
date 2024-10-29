<template>
  <div>
    <h1>VMess URL Editor</h1>
    <section>
      <div class="flex items-start">
        <div class="flex-1 min-w-0 mr-4">
          <div class="mb-1">VMess URLs</div>
          <VlCode
            class="t-code"
            @ready="onContentReady"
            :options="optionsContent"
          />
        </div>
        <div class="flex-1 min-w-0 mr-4">
          <div class="mb-1">Detail</div>
          <VlCode
            class="t-code"
            v-model="urlDetail.value"
            :options="optionsDetail"
          />
        </div>
        <div>
          <div class="mb-1">QRCode for Client</div>
          <QRCanvas
            class="qrcode"
            :width="300"
            :height="300"
            :options="optionsQR"
          />
        </div>
      </div>
      <div class="mt-4">
        <button class="mr-2 mb-1" @click="onClientConfig">
          Get client config
        </button>
        <button class="mr-2 mb-1" @click="onServerConfig">
          Get server config
        </button>
      </div>
    </section>
    <VlModal v-if="modal" show @close="modal = null">
      <div class="modal-content mx-auto flex flex-col" style="height: 80vh">
        <div class="mb-2" v-text="modal.title"></div>
        <textarea
          class="flex-1 form-input"
          readonly
          :value="modal.value"
          @click="$event.target.select()"
        ></textarea>
      </div>
    </VlModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import yaml from "yaml";
import { QRCanvas } from "qrcanvas-vue";
import { debounce } from "lodash-es";
import { loadVMess, dumpVMess } from "~/components/url";
import VlModal from "~/components/vl-modal";
import { VlCode, defaultOptions } from "~/components/vl-code";
import { defaultQROptions } from "~~/components/common";
import {
  createClientConfig,
  createServerConfig,
} from "common-lib/src/v2fly-config";

const optionsContent = computed(() => ({
  ...defaultOptions,
  mode: null,
  styleActiveLine: true,
}));
const optionsDetail = computed(() => ({
  ...defaultOptions,
  mode: "yaml",
}));

const urlDetail = reactive<{
  line?: number;
  url?: string;
  value: string;
}>({
  value: "",
});
const modal = ref<{
  title: string;
  value: string;
}>();

const optionsQR = computed(() => ({
  ...defaultQROptions,
  data: urlDetail.url,
}));

let updateCurrent: (value: string) => void = () => {};

watch(
  () => urlDetail.value,
  (value) => updateCurrent(value)
);

function onContentReady(cm) {
  const setCurrent = debounce(() => {
    const { line } = cm.getCursor();
    const url = cm.getLine(line).trim();
    if (line === urlDetail.line && url === urlDetail.url) return;
    let value = "";
    try {
      const data = loadVMess(new URL(url));
      value = yaml.stringify(data);
    } catch {
      // noop
    }
    Object.assign(urlDetail, {
      line,
      url,
      value,
    });
  }, 200);
  updateCurrent = debounce((value: string) => {
    let url: string;
    if (value) {
      try {
        url = dumpVMess(yaml.parse(value)).toString();
      } catch {
        // noop
      }
    }
    const { line } = cm.getCursor();
    if (url && line === urlDetail.line && url !== urlDetail.url) {
      urlDetail.url = url;
      urlDetail.value = value;
      cm.replaceRange(`${url}\n`, { line, ch: 0 }, { line: line + 1, ch: 0 });
      cm.setCursor({ line, ch: 0 });
    }
  }, 200) as (value: string) => void;
  cm.on("cursorActivity", setCurrent);
  cm.on("changes", setCurrent);
}

function onClientConfig() {
  if (!urlDetail.value) return;
  try {
    const data = yaml.parse(urlDetail.value);
    const prefix = `// ${urlDetail.url}\n\n`;
    modal.value = {
      title: "Client config",
      value: prefix + JSON.stringify(createClientConfig(data), null, 2),
    };
  } catch {
    // noop
  }
}

function onServerConfig() {
  if (!urlDetail.value) return;
  try {
    const data = yaml.parse(urlDetail.value);
    const prefix = `// ${urlDetail.url}\n\n`;
    modal.value = {
      title: "Server config",
      value: prefix + JSON.stringify(createServerConfig(data), null, 2),
    };
  } catch {
    // noop
  }
}
</script>
