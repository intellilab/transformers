<template>
  <div>
    <h1>VMess URL Editor</h1>
    <section>
      <div class="flex items-start">
        <div class="flex-1 min-w-0 mr-4">
          <div class="mb-1">VMess URLs</div>
          <CodeEditor
            ref="editorList"
            class="t-code"
            v-model="state.urlList"
            @focus="state.editor = 'list'"
            @cursor-move="handleCursorChange"
          />
          <div v-if="!state.active.valid" class="text-red-500">
            Invalid URL (Line {{ state.active.line }})
          </div>
        </div>
        <div class="flex-1 min-w-0 mr-4">
          <div class="mb-1">Detail</div>
          <CodeEditor
            ref="editorDetail"
            class="t-code"
            v-model="state.active.detail"
            lang="yaml"
            @focus="state.editor = 'detail'"
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
        <button
          class="mr-2 mb-1"
          @click="onClientConfig"
          :disabled="!state.active.detail || !state.active.valid"
        >
          Get client config
        </button>
        <button
          class="mr-2 mb-1"
          @click="onServerConfig"
          :disabled="!state.active.detail || !state.active.valid"
        >
          Get server config
        </button>
      </div>
    </section>
    <div v-if="modal" class="modal" @click="modal = undefined">
      <div class="modal-content flex flex-col" style="height: 80vh" @click.stop>
        <div class="mb-2" v-text="modal.title"></div>
        <CodeEditor
          class="flex-1 form-input min-h-0"
          readonly
          lang="json"
          :model-value="modal.content"
          @click="$event.target.select()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import yaml from "yaml";
import { QRCanvas } from "qrcanvas-vue";
import { loadVMess, dumpVMess } from "~/components/url";
import { defaultQROptions } from "~~/components/common";
import CodeEditor from "~/components/code-editor.vue";
import {
  createClientConfig,
  createServerConfig,
} from "common-lib/src/v2fly-config";

const editorList = ref<typeof CodeEditor>();
const editorDetail = ref<typeof CodeEditor>();
const state = reactive<{
  editor: "list" | "detail";
  urlList: string;
  active: {
    /** Active 1-based line number, always >= 1 */
    line: number;
    url: string;
    detail: string;
    valid: boolean;
  };
}>({
  editor: "list",
  urlList: "",
  active: {
    line: 1,
    url: "",
    detail: "",
    valid: true,
  },
});
const modal = ref<{
  title: string;
  content: string;
}>();

const optionsQR = computed(() => ({
  ...defaultQROptions,
  data: state.active.url,
}));

watch(
  () => [state.active.line, state.urlList, state.editor],
  () => {
    if (state.editor !== "list") return;
    const url = state.urlList.split("\n")[state.active.line - 1];
    let value = "";
    let valid = true;
    if (url.startsWith("vmess:")) {
      let data: unknown;
      ({ data, valid } = loadVMess(new URL(url)));
      value = yaml.stringify(data);
    }
    Object.assign(state.active, {
      url,
      detail: value,
      valid,
    });
  }
);

watch(
  () => state.active.detail,
  (value) => {
    if (state.editor !== "detail" || !editorList.value) return;
    let url = "";
    if (value) {
      try {
        url = dumpVMess(yaml.parse(value)).toString();
      } catch {
        // noop
      }
    }
    if (url) editorList.value.replaceLine(state.active.line, url);
  }
);

function handleCursorChange(line: number) {
  state.active.line = line;
}

function onClientConfig() {
  if (!state.active.detail || !state.active.valid) return;
  try {
    const data = yaml.parse(state.active.detail);
    modal.value = {
      title: "Client config",
      content: JSON.stringify(createClientConfig(data), null, 2),
    };
  } catch {
    // noop
  }
}

function onServerConfig() {
  if (!state.active.detail || !state.active.valid) return;
  try {
    const data = yaml.parse(state.active.detail);
    modal.value = {
      title: "Server config",
      content: JSON.stringify(createServerConfig(data), null, 2),
    };
  } catch {
    // noop
  }
}
</script>
