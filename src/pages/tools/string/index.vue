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
    </section>
    <section class="container">
      <h3>Pipes</h3>
      <button v-for="pipe in pipes" class="btn btn-primary mr-2" v-text="pipe.meta.name" @click="addPipe(pipe)"></button>
    </section>
  </div>
</template>

<script>
const requirePipe = require.context('./pipes', false, /\.js$/);
const pipes = requirePipe.keys().map(key => requirePipe(key));

export default {
  meta: {
    name: 'string',
    title: 'String pipes',
  },
  data() {
    return {
      input: '',
      error: false,
      pipes,
      appliedPipes: [],
    };
  },
  computed: {
    output() {
      try {
        this.error = false;
        return this.appliedPipes.reduce((result, { pipe, options }) => {
          return pipe.handle(result, options);
        }, this.input);
      } catch (e) {
        this.error = true;
        return e.toString();
      }
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
      return `[${repr}]`;
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
