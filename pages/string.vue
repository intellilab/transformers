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
          <textarea class="form-input" :class="{'bg-red-300': output.error}" rows="18" v-model="input"></textarea>
        </div>
        <div class="flex-1">
          <label>Output</label>
          <textarea class="form-input" rows="18" readonly :value="output.data"></textarea>
        </div>
      </div>
    </section>
    <pipe-section ref="pipe" :input="input" :pipes="pipes" @change="onChange"></pipe-section>
    <div class="mt-4">
      <button class="mr-2 mb-1" @click="onShare">Share</button>
    </div>
    <div v-if="shareContent">
      <input class="form-input" readonly :value="shareContent.url" @click="onSelectAll" />
    </div>
  </div>
</template>

<script>
import tracker from '~/components/tracker';
import PipeSection from '~/components/pipe-section';

const requirePipe = require.context('~/components/string/pipes', false, /\.js$/);
const pipes = requirePipe.keys().map(key => {
  const pipe = requirePipe(key);
  pipe.meta._search = pipe.meta.name.toLowerCase();
  pipe.meta.key = key.slice(2, -3);
  return pipe;
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
      shareContent: null,
    };
  },
  methods: {
    onClear() {
      this.input = '';
    },
    onChange(output) {
      this.output = output;
    },
    onShare() {
      const { origin, pathname, search } = window.location;
      const { input } = this;
      const pipeData = this.$refs.pipe.dumpPipes();
      const query = {
        i: input,
        p: JSON.stringify(pipeData),
      };
      let qs = Object.entries(query)
        .map(([key, value]) => value && [key, value].map(encodeURIComponent).join('='))
        .filter(Boolean)
        .join('&');
      qs = `${qs}&_=`; // in case url is modified by other apps
      const url = `${origin}${pathname}${search}#${qs}`;
      this.shareContent = {
        url,
      };
    },
    onSelectAll(e) {
      e.target.select();
    },
    checkHash() {
      const query = new URLSearchParams(window.location.hash.slice(1));
      try {
        const input = query.get('i');
        const queryPipes = JSON.parse(query.get('p'));
        if (input && queryPipes) {
          this.input = input;
          this.$refs.pipe.loadPipes(queryPipes);
        }
      } finally {
        window.location.hash = '';
      }
    },
  },
  mounted() {
    this.checkHash();
  },
};
</script>
