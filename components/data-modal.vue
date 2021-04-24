<template>
  <vl-modal :visible="visible" @close="$emit('close')">
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
  </vl-modal>
</template>

<script>
import VlModal from './vl-modal';

export default {
  components: {
    VlModal,
  },
  props: [
    'visible',
    'title',
    'content',
    'readOnly',
  ],
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
