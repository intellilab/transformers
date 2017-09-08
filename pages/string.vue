<template>
  <div class="tool-string">
    <h1>String Pipes</h1>
    <section class="container">
      <div class="columns">
        <div class="column col-6">
          <h6>Input</h6>
          <textarea class="form-input" :class="{'is-error': error}" rows="18" v-model="input"></textarea>
        </div>
        <div class="column col-6">
          <h6>Output</h6>
          <textarea class="form-input" rows="18" readonly :value="output"></textarea>
        </div>
      </div>
    </section>
    <section class="container">
      <h3>Applied pipes</h3>
      <div v-for="(item, index) in appliedPipes" class="tool-string-pipe mr-2 mb-2">
        <strong v-text="item.pipe.meta.name" class="mr-2"></strong>
        <span v-text="reprOptions(item.options)"></span>
        <button class="btn btn-clear" @click="onRemovePipe(index)"></button>
      </div>
      <p class="text-gray" v-if="!appliedPipes.length">No pipe is applied.</p>
    </section>
    <section class="container">
      <h3>Pipes</h3>
      <div class="form-group has-icon-right">
        <input type="search" class="form-input" placeholder="Filter pipes..." v-model="search">
        <i class="form-icon icon icon-cross" @click="search = ''"></i>
      </div>
      <button v-for="pipe in filteredPipes" class="btn btn-primary mr-2" v-text="pipe.meta.name" @click="addPipe(pipe)"></button>
      <p class="text-gray" v-if="!filteredPipes.length">No pipe is found.</p>
    </section>
  </div>
</template>

<script>
const requirePipe = require.context('~/components/string/pipes', false, /\.js$/);
const pipes = requirePipe.keys().map(key => requirePipe(key));
pipes.forEach(pipe => {
  pipe.meta._search = pipe.meta.name.toLowerCase();
});

export default {
  meta: {
    name: 'string',
    title: 'String pipes',
  },
  data() {
    return {
      input: '',
      search: '',
      error: false,
      pipes,
      appliedPipes: [],
    };
  },
  computed: {
    output() {
      try {
        this.error = false;
        return this.appliedPipes.reduce((result, { pipe, options }) =>
          pipe.handle(result, options), this.input);
      } catch (e) {
        this.error = true;
        return e.toString();
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
    onRemovePipe(index) {
      this.appliedPipes.splice(index, 1);
    },
  },
};
</script>

<style>
.tool-string {
  textarea {
    font-family: monospace;
    resize: none;
  }
  .tool-string-pipe {
    display: inline-block;
    padding: .2rem .3rem;
    border: .05rem solid #5764c6;
    border-radius: .1rem;
  }
}
</style>
