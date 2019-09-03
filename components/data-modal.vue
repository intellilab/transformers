<template>
  <div class="modal active">
    <div class="modal-overlay" @click="onClose"></div>
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-title" v-text="title"></div>
      </div>
      <div class="modal-body">
        <div class="content">
          <textarea
            class="form-input"
            rows="10"
            :value="content"
            :readOnly="readOnly"
            @input="onChange"
            @click="onClick"
          />
        </div>
      </div>
      <div class="modal-footer">
        <slot></slot>
      </div>
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
