<template>
  <div>
    <h1>Color Pipes</h1>
    <section class="flex mb-2">
      <div class="flex-1 mr-4">
        <label>Input</label>
        <div class="flex">
          <input class="form-input flex-1" v-model="input" :class="{'bg-red-300': output.error}">
          <div class="w-8 h-8 ml-2 border border-gray-400" :style="renderBg(input)"></div>
        </div>
      </div>
      <div class="flex-1">
        <label>Output</label>
        <div class="flex">
          <input v-for="(item, key) in output.data" :key="key" class="form-input flex-1" readonly :value="item">
          <div class="w-8 h-8 ml-2 border border-gray-400" :style="renderBg(outputColor)"></div>
        </div>
      </div>
    </section>
    <pipe-section :input="inputColor" :pipes="pipes" @change="onChange"></pipe-section>
  </div>
</template>

<script>
import tracker from '~/components/tracker';
import PipeSection from '~/components/pipe-section';
import { parseColor, reprColor } from '~/components/color/util';
import { debounce } from '~/components/utils';

const requirePipe = require.context('~/components/color/pipes', false, /\.js$/);
const pipes = requirePipe.keys().map(key => requirePipe(key));
pipes.forEach(pipe => {
  pipe.meta._search = pipe.meta.name.toLowerCase();
});

export default {
  mixins: [tracker],
  components: {
    PipeSection,
  },
  meta: {
    name: 'color',
    title: 'Color pipes',
  },
  data() {
    return {
      input: '',
      output: {},
      pipes,
    };
  },
  computed: {
    inputColor() {
      try {
        return this.input && parseColor(this.input);
      } catch {
        return null;
      }
    },
    outputColor() {
      return this.output.data?.simple;
    },
  },
  methods: {
    onChange(output) {
      const { error, data: color } = output;
      const result = {
        error,
        data: { simple: '', rgb: '' },
      };
      if (color) {
        const { data } = result;
        data.simple = reprColor(color);
        const { r, g, b } = color;
        const a = `${+color.a.toFixed(3)}`.replace(/^0/, '');
        if (a === '1') {
          data.rgb = `rgb(${r},${g},${b})`;
        } else {
          data.rgb = `rgba(${r},${g},${b},${a})`;
        }
      }
      this.output = result;
    },
    renderBg(color) {
      try {
        const normalized = reprColor(parseColor(color));
        return `background-color: ${normalized}`;
      } catch {
        return null;
      }
    },
  },
};
</script>
