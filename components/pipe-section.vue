<template>
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
        <div :key="index" class="tool-string-pipe mr-2 mb-2" :class="{'bg-red-300': item.pipe === errorPipe}" @click="editing = item">
          <div class="flex">
            <strong v-text="item.pipe.meta.name" class="flex-1 mr-2"></strong>
            <a href="#" @click.prevent.stop="onRemovePipe(index)">
              <svg viewBox="0 0 20 20" fill="currentColor" class="x w-6 h-6"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
          </div>
          <span class="text-xs" v-text="reprOptions(item.options)"></span>
        </div>
      </template>
      <span class="mr-2">&rarr;</span>
      <div class="tool-string-pipe disabled">Output</div>
    </div>
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
    <div class="modal" v-if="editing">
      <div class="modal-overlay" @click="onStopEditing"></div>
      <div class="modal-content">
        <div class="font-bold mb-2" v-text="editing.pipe.meta.name"></div>
        <template v-if="editing.pipe.meta.options.length">
          <div v-for="(option, index) in editing.pipe.meta.options" :key="index" class="mb-2">
            <div v-if="option.type === 'checkbox'">
              <label class="block">
                <input type="checkbox" v-model="editing.options[option.name]">
                <span v-text="option.description"></span>
              </label>
            </div>
            <div v-else>
              <label class="block" v-text="option.description"></label>
              <div v-if="option.type === 'radio'">
                <label v-for="(choice, index) in option.choices" class="block" :key="index">
                  <input type="radio" :value="choice.value" v-model="editing.options[option.name]">
                  <span v-text="choice.label"></span>
                </label>
              </div>
              <input v-else-if="option.type === 'number'" class="form-input" type="number" v-model.number="editing.options[option.name]">
              <input v-else class="form-input" v-model="editing.options[option.name]">
            </div>
          </div>
        </template>
        <div class="empty" v-else>
          <div class="empty-title">No options available</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { debounce } from '~/components/utils';

export default {
  props: ['input', 'pipes'],
  data() {
    return {
      appliedPipes: [],
      search: '',
      editing: null,
      errorPipe: null,
    };
  },
  computed: {
    filteredPipes() {
      if (!this.search) return this.pipes;
      const search = this.search.toLowerCase();
      return this.pipes.filter(pipe => pipe.meta._search.includes(search));
    },
  },
  watch: {
    input: {
      handler: 'update',
      immediate: true,
    },
    appliedPipes: {
      handler: 'update',
      deep: true,
    },
  },
  methods: {
    update: debounce(function update() {
      let output;
      let lastPipe;
      try {
        let data = this.input;
        if (this.input) {
          for (const { pipe, options } of this.appliedPipes) {
            lastPipe = pipe;
            data = pipe.handle(data, options);
          }
        }
        lastPipe = null;
        output = {
          data,
        };
      } catch (e) {
        output = {
          error: e,
        };
      }
      this.errorPipe = lastPipe;
      this.$emit('change', output);
    }, 300),
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
    onClearPipes() {
      this.appliedPipes.splice(0);
    },
    onStopEditing() {
      this.editing = null;
    },
  },
};
</script>
