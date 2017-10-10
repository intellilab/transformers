<template>
  <div>
    <h1>QRCode</h1>
    <section class="container">
      <div class="columns">
        <div class="column col-3">
          <div class="form-group">
            <label class="form-label">Content</label>
            <textarea class="form-input" v-model="qr.content" />
          </div>
          <div class="form-group">
            <label class="form-label">Label</label>
            <input class="form-input" v-model="qr.label" />
          </div>
        </div>
        <div class="column col-6">
          <qr-canvas :options="options"></qr-canvas>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import QrCanvas from 'qrcanvas-vue';

function debounce(func, time) {
  let timer;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, time);
  };
}

export default {
  components: {
    QrCanvas,
  },
  data() {
    return {
      qr: {
        content: '',
        label: '',
      },
      options: null,
    };
  },
  watch: {
    qr: {
      deep: true,
      handler() {
        this.updateOptionsLater();
      },
    },
  },
  methods: {
    updateOptions() {
      const { label, content } = this.qr;
      const logo = label && {
        text: label,
        clearEdges: 3,
      };
      this.options = {
        cellSize: 4,
        data: content,
        logo,
      };
    },
  },
  mounted() {
    this.updateOptionsLater = debounce(this.updateOptions, 200);
    this.updateOptions();
  },
};
</script>
