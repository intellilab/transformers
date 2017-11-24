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
            <label class="form-label">Label (shown on QRCode)</label>
            <input class="form-input" v-model="qr.label" />
          </div>
          <div class="form-group">
            <label class="form-label">Name</label>
            <input class="form-input" v-model="qr.name" />
          </div>
          <div>
            <button class="btn mr-2 mb-1" @click="onReset">Reset</button>
            <button class="btn mr-2 mb-1" :disabled="!qr.content" @click="onSave()">Save as bookmark</button>
            <button class="btn mr-2 mb-1" :disabled="!qr.content" @click="onSave(1)">Save as new bookmark</button>
          </div>
        </div>
        <div class="column col-6">
          <qr-canvas :options="options"></qr-canvas>
        </div>
        <bookmarks
          ref="bookmarks"
          class="column col-3 mt-2 d-flex flex-column"
          :active="active"
          storage-key="qrcode/bookmarks"
          @pick="onPick"
        />
      </div>
    </section>
  </div>
</template>

<script>
import QrCanvas from 'qrcanvas-vue';
import { debounce } from '~/components/utils';
import Bookmarks from '~/components/bookmarks';

export default {
  components: {
    QrCanvas,
    Bookmarks,
  },
  data() {
    return {
      qr: {},
      active: null,
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
    onReset() {
      this.active = null;
      this.qr = {
        content: '',
        label: '',
        name: '',
      };
    },
    onSave(asNew) {
      const item = {
        name: this.qr.name || this.qr.label || 'No name',
        data: Object.assign({}, this.qr),
      };
      this.active = this.$refs.bookmarks.update(item, asNew ? -1 : this.activeIndex);
    },
    onPick(item, index) {
      this.active = item;
      this.activeIndex = index;
      this.qr = Object.assign({}, item, item.data);
    },
  },
  mounted() {
    this.onReset();
    this.updateOptionsLater = debounce(this.updateOptions, 200);
    this.updateOptions();
  },
};
</script>

<style>
.bookmarks {
  max-height: 400px;
  overflow: auto;
  > :not(:hover) > .btn-clear {
    display: none;
  }
}
</style>
