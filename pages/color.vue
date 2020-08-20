<template>
  <div>
    <h1>Color Pipes</h1>
    <section class="flex mb-2">
      <div class="flex-1 mr-4">
        <label>Input</label>
        <div class="flex">
          <input class="form-input flex-1" v-model="input" :class="{'bg-red-300': output.error}">
          <div class="w-8 ml-2 border border-gray-400" :style="renderBg(input)"></div>
        </div>
      </div>
      <div class="flex-1">
        <label>Output</label>
        <div class="flex">
          <input class="form-input flex-1" readonly :value="output.content">
          <div class="w-8 ml-2 border border-gray-400" :style="renderBg(output.content)"></div>
        </div>
      </div>
    </section>
    <section>
      <div class="flex mb-2">
        <h3 class="d-inline-block">Applied pipes</h3>
        <a class="ml-4" href="#" v-if="appliedPipes.length" @click.prevent="onClearPipes">
          <svg viewBox="0 0 20 20" fill="currentColor" class="trash w-6 h-6"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
        </a>
      </div>
      <div>
        <div class="tool-string-pipe mr-2 disabled">Input</div>
        <template v-for="(item, index) in appliedPipes">
          <span :key="`arrow-${index}`" class="mr-2">&rarr;</span>
          <div :key="index" class="tool-string-pipe mr-2 mb-2" @click="editing = item">
            <div class="flex">
              <strong v-text="item.pipe.meta.name" class="flex-1 mr-2"></strong>
              <a href="#" @click.prevent="onRemovePipe(index)">
                <svg viewBox="0 0 20 20" fill="currentColor" class="x w-6 h-6"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              </a>
            </div>
            <span class="text-xs" v-text="reprOptions(item.options)"></span>
          </div>
        </template>
        <span class="mr-2">&rarr;</span>
        <div class="tool-string-pipe disabled">Output</div>
      </div>
    </section>
    <section>
      <h3 class="mt-2 mb-1">Pipes</h3>
      <div class="mb-2">
        <input type="search" class="form-input" placeholder="Filter pipes..." v-model="search">
      </div>
      <button
        v-for="(pipe, index) in filteredPipes"
        :key="index"
        class="mr-2 mb-2"
        v-text="pipe.meta.name"
        @click="addPipe(pipe)"
      />
      <p class="text-gray" v-if="!filteredPipes.length">No pipe is found.</p>
    </section>
  </div>
</template>

<script>
import tracker from '~/components/tracker';
import { parseColor, reprColor } from '~/components/color/util';

const requirePipe = require.context('~/components/color/pipes', false, /\.js$/);
const pipes = requirePipe.keys().map(key => requirePipe(key));
pipes.forEach(pipe => {
  pipe.meta._search = pipe.meta.name.toLowerCase();
});

export default {
  mixins: [tracker],
  meta: {
    name: 'color',
    title: 'Color pipes',
  },
  data() {
    return {
      input: '',
      search: '',
      pipes,
      appliedPipes: [],
    };
  },
  computed: {
    output() {
      try {
        return {
          content: this.input && reprColor(this.appliedPipes.reduce(
            (result, { pipe, options }) => pipe.handle(result, options),
            parseColor(this.input),
          )),
        };
      } catch (e) {
        return {
          error: e,
          content: e.toString(),
        };
      }
    },
    filteredPipes() {
      if (!this.search) return pipes;
      const search = this.search.toLowerCase();
      return pipes.filter(pipe => pipe.meta._search.includes(search));
    },
  },
  methods: {
    addPipe(pipe) {
      const options = pipe.meta.options.reduce((res, item) => {
        if (item.default != null) res[item.name] = item.default;
        return res;
      }, {});
      this.appliedPipes.push({
        pipe,
        options,
      });
    },
    reprOptions(options) {
      const repr = Object.keys(options)
      .map(key => `${key}=${options[key]}`)
      .join(';');
      return repr ? `[${repr}]` : '';
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
