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
            <button class="btn mr-2" @click="onReset">Reset</button>
            <button class="btn mr-2" :disabled="!qr.content" @click="onSave">Bookmark</button>
          </div>
        </div>
        <div class="column col-6">
          <qr-canvas :options="options"></qr-canvas>
        </div>
        <div class="column col-3 mt-2 d-flex flex-column">
          <h3>My bookmarks</h3>
          <!-- div class="mb-2">
            <input class="form-input" placeholder="Search..." />
          </div -->
          <div class="empty" v-if="!store.bookmarks.length"><div class="empty-title">Nothing</div></div>
          <ul class="menu bookmarks" v-else>
            <li class="menu-item" v-for="(item, index) in store.bookmarks">
              <button class="btn btn-clear float-right mt-2" @click="onRemove(index)"></button>
              <a href="#" v-text="item.name" @click.prevent="onPick(item)"></a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import QrCanvas from 'qrcanvas-vue';

const store = {
  bookmarks: [],
};
const lsKey = 'qrcode/bookmarks';

function debounce(func, time) {
  let timer;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, time);
  };
}

function loadData() {
  let bookmarks;
  try {
    bookmarks = JSON.parse(localStorage.getItem(lsKey));
  } catch (e) {
    // ignore error
  }
  store.bookmarks = bookmarks || [];
}

function dumpData() {
  localStorage.setItem(lsKey, JSON.stringify(store.bookmarks));
}

export default {
  components: {
    QrCanvas,
  },
  data() {
    return {
      store,
      qr: {},
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
      this.qr = {
        content: '',
        label: '',
        name: '',
      };
    },
    onSave() {
      this.store.bookmarks.push(Object.assign({}, this.qr, {
        name: this.qr.name || this.qr.label || 'No name',
      }));
      dumpData();
    },
    onPick(item) {
      this.qr = Object.assign({}, item);
    },
    onRemove(index) {
      this.store.bookmarks.splice(index, 1);
      dumpData();
    },
  },
  mounted() {
    this.onReset();
    this.updateOptionsLater = debounce(this.updateOptions, 200);
    this.updateOptions();
    loadData();
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
