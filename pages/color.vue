<template>
  <div>
    <h1>Color Pipes</h1>
    <section class="flex mb-2">
      <div class="flex-1 mr-4">
        <label>Input</label>
        <div class="flex">
          <input class="form-input flex-1" :value="input" @input="onInput" :class="{'bg-red-300': error || output.error}">
          <div class="w-8 h-8 ml-2 border border-gray-400" :style="renderBg(input)"></div>
        </div>
      </div>
      <div class="flex-1">
        <label>Output</label>
        <div class="flex items-center" v-for="(item, key) in output.data" :key="key">
          <div class="w-16 text-gray-600" v-text="key"></div>
          <input class="form-input flex-1" readonly :value="item" @click="$event.target.select()">
          <div class="w-8 h-8 ml-2 border border-gray-400" :style="{ background: item }"></div>
        </div>
      </div>
    </section>
    <pipe-section :input="inputColor" :pipes="pipes" @change="onChange"></pipe-section>
  </div>
</template>

<script>
import tracker from '~/components/tracker';
import PipeSection from '~/components/pipe-section';
import { parseColor, reprHex, reprRgba, reprHsla } from '~/components/color/util';

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
      input: null,
      inputColor: null,
      error: null,
      output: {},
      pipes,
    };
  },
  methods: {
    onInput(e) {
      const { value } = e.target;
      this.input = value;
      try {
        this.inputColor = value && parseColor(value);
        this.error = null;
      } catch (err) {
        this.inputColor = null;
        this.error = err;
      }
    },
    onChange(output) {
      const { error, data: color } = output;
      const result = {
        error,
        data: { Hex: '', RGBA: '', HSLA: '' },
      };
      if (color) {
        const { data } = result;
        data.Hex = reprHex(color);
        data.RGBA = reprRgba(color);
        data.HSLA = reprHsla(color);
      }
      this.output = result;
    },
    renderBg(color) {
      try {
        const normalized = reprHex(parseColor(color));
        return `background-color: ${normalized}`;
      } catch {
        return null;
      }
    },
  },
};
</script>
