<template>
  <div class="tool-string">
    <h1>String Pipes</h1>
    <section class="mb-2">
      <div class="flex">
        <div class="flex-1 mr-4">
          <div class="flex">
            <label>Input</label>
            <a class="ml-4" href="#" v-if="input" @click.prevent="onClear">
              <svg viewBox="0 0 20 20" fill="currentColor" class="trash w-6 h-6"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            </a>
          </div>
          <textarea class="form-input" :class="{'is-error': output.error}" rows="18" v-model="input"></textarea>
        </div>
        <div class="flex-1">
          <label>Output</label>
          <textarea class="form-input" rows="18" readonly :value="output.data"></textarea>
        </div>
      </div>
    </section>
    <pipe-section :input="input" :pipes="pipes" @change="onChange"></pipe-section>
  </div>
</template>

<script>
import tracker from '~/components/tracker';
import PipeSection from '~/components/pipe-section';

const requirePipe = require.context('~/components/string/pipes', false, /\.js$/);
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
    name: 'string',
    title: 'String pipes',
  },
  data() {
    return {
      input: '',
      output: {},
      pipes,
    };
  },
  methods: {
    onClear() {
      this.input = '';
    },
    onChange(output) {
      this.output = output;
    },
  },
};
</script>
