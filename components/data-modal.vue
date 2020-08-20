<template>
  <div class="modal">
    <div class="modal-overlay" @click="onClose"></div>
    <div class="modal-content">
      <div class="mb-2" v-text="title"></div>
      <div class="mb-2">
        <textarea
          class="form-input"
          rows="10"
          :value="content"
          :readOnly="readOnly"
          @input="onChange"
          @click="onClick"
        />
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
    content: {},
    readOnly: {},
  },
  methods: {
    onChange(e) {
      this.$emit('change', e.target.value);
    },
    onClick(e) {
      if (this.readOnly) {
        const { target } = e;
        setTimeout(() => {
          target.select();
        });
      }
    },
    onClose() {
      this.$emit('close');
    },
  },
};
</script>
