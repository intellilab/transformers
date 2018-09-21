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
      <div class="mt-2">
        <h3 class="d-inline-block">Applied pipes</h3>
        <button class="btn btn-sm ml-2" v-if="appliedPipes.length" @click="clearPipes">Clear</button>
      </div>
      <div class="tool-string-pipe mr-2 disabled">Input</div>
      <template v-for="(item, index) in appliedPipes">
        <span class="mr-2">&rarr;</span>
        <div class="tool-string-pipe mr-2 mb-2" @click="editing = item">
          <strong v-text="item.pipe.meta.name" class="mr-2"></strong>
          <span v-text="reprOptions(item.options)"></span>
          <button class="btn btn-clear" @click.stop="onRemovePipe(index)"></button>
        </div>
      </template>
      <span class="mr-2">&rarr;</span>
      <div class="tool-string-pipe disabled">Output</div>
    </section>
    <section class="container">
      <h3 class="mt-2">Pipes</h3>
      <div class="form-group has-icon-right">
        <input type="search" class="form-input" placeholder="Filter pipes..." v-model="search">
        <i class="form-icon icon icon-cross" @click="search = ''"></i>
      </div>
      <button v-for="pipe in filteredPipes" class="btn btn-primary mr-2 mb-2" v-text="pipe.meta.name" @click="addPipe(pipe)"></button>
      <p class="text-gray" v-if="!filteredPipes.length">No pipe is found.</p>
    </section>
    <section class="modal active" v-if="editing">
      <div class="modal-overlay" @click="onStopEditing"></div>
      <div class="modal-container">
        <div class="modal-header">
          <button class="btn btn-clear float-right" @click="onStopEditing"></button>
          <div class="modal-title h5" v-text="editing.pipe.meta.name"></div>
        </div>
        <div class="modal-body">
          <div class="content" v-if="editing.pipe.meta.options.length">
            <div class="form-group" v-for="option in editing.pipe.meta.options">
              <div v-if="option.type === 'checkbox'">
                <label class="form-switch">
                  <input type="checkbox" v-model="editing.options[option.name]">
                  <i class="form-icon"></i>
                  <span v-text="option.description"></span>
                </label>
              </div>
              <div v-else>
                <label class="form-label" v-text="option.description"></label>
                <div v-if="option.type === 'radio'">
                  <label v-for="choice in option.choices" class="form-radio">
                    <input type="radio" :value="choice.value" v-model="editing.options[option.name]">
                    <i class="form-icon"></i>
                    <span v-text="choice.label"></span>
                  </label>
                </div>
                <input v-else-if="option.type === 'number'" class="form-input" type="number" v-model.number="editing.options[option.name]">
                <input v-else class="form-input" v-model="editing.options[option.name]">
              </div>
            </div>
          </div>
          <div class="empty" v-else>
            <div class="empty-title">No options available</div>
          </div>
        </div>
      </div>
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
      editing: null,
    };
  },
  computed: {
    output() {
      try {
        this.error = false;
        return this.appliedPipes.reduce(
          (result, { pipe, options }) => pipe.handle(result, options),
          this.input,
        );
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
    clearPipes() {
      this.appliedPipes.splice(0);
    },
    onStopEditing() {
      this.editing = null;
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
  &-pipe {
    display: inline-block;
    padding: .2rem .3rem;
    border: .05rem solid #5764c6;
    border-radius: .1rem;
    &.disabled {
      border-color: #caced7;
    }
  }
  .modal-container {
    width: 80%;
    max-width: 20rem;
  }
}
</style>
