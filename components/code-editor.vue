<template>
  <div ref="refCode" :class="{ 'child-error': hasError }"></div>
</template>

<style scoped>
div :deep(.cm-editor) {
  height: 100%;
}
</style>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { EditorView, basicSetup } from 'codemirror';
import { linter, lintGutter, type Diagnostic, type LintSource } from '@codemirror/lint';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { yaml } from '@codemirror/lang-yaml';
import { EditorState, Compartment, type Extension } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { keymap, placeholder } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';

const model = defineModel<string>();
const props = defineProps<{
  lang?: string;
  readonly?: boolean;
  contentType?: string;
  placeholder?: string;
  linter?: LintSource;
}>();
const emit = defineEmits<{
  cursorMove: [line: number];
  focus: [];
  blur: [];
  input: [];
}>();
defineExpose({ replaceLine });

const langExtMap: Record<string, () => Extension[]> = {
  json: () => [json(), linter(jsonParseLinter()), lintGutter()],
  html: () => [html()],
  yaml: () => [yaml()],
};

const refCode = ref<HTMLElement>();

let view: EditorView | undefined;
let lastModel = '';

const langExtComp = new Compartment();
const lintComp = new Compartment();
const viewComp = new Compartment();

const hasError = ref(false);
const langExt = computed(() => langExtMap[props.lang || '']?.() || []);
const linterExt = computed(() =>
  props.linter ? [linter(props.linter), lintGutter()] : [],
);
const viewExt = computed(() => [
  ...(isDark.value ? [oneDark] : []),
  ...(props.placeholder ? [placeholder(props.placeholder)] : []),
]);

const result = window.matchMedia('(prefers-color-scheme: dark');
const isDark = ref(result.matches);
result.addEventListener('change', (e) => {
  isDark.value = e.matches;
});

watch(langExt, (ext) => {
  view?.dispatch({
    effects: langExtComp.reconfigure(ext),
  });
});

watch(linterExt, (ext) => {
  view?.dispatch({
    effects: lintComp.reconfigure(ext),
  });
});

watch(viewExt, (ext) => {
  view?.dispatch({
    effects: viewComp.reconfigure(ext),
  });
});

watch(model, (value) => {
  if (!view || value === lastModel) return;
  view.dispatch({
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: value,
    },
  });
});

function replaceLine(lineNo: number, content: string) {
  if (!view) return;
  const line = view.state.doc.line(lineNo);
  view.dispatch({
    changes: {
      from: line.from,
      to: line.to,
      insert: content,
    },
    scrollIntoView: true,
  });
}

onMounted(() => {
  view = new EditorView({
    doc: model.value || '',
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      EditorState.readOnly.of(props.readonly),
      langExtComp.of(langExt.value),
      lintComp.of(linterExt.value),
      viewComp.of(viewExt.value),
      EditorView.updateListener.of((update) => {
        if (update.focusChanged) {
          if (update.view.hasFocus) emit('focus');
          else emit('blur');
        }
        if (update.selectionSet) {
          const lineNo = update.view.state.doc.lineAt(
            update.view.state.selection.main.head,
          ).number;
          emit('cursorMove', lineNo);
        }
        if (update.docChanged) {
          lastModel = update.view.state.doc.toString();
          model.value = lastModel;
          emit('input');
        }
      }),
    ],
    parent: refCode.value,
  });
});
</script>
