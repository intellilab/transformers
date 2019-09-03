<template>
  <div class="snapshots">
    <div class="d-flex">
      <div class="flex-1">
        <slot name="title"><span v-text="title"></span></slot>
      </div>
      <div>
        <a href="#" class="ml-1 tooltip" data-tooltip="Import" @click.prevent="onImport">
          <i class="icon icon-upload"></i>
        </a>
        <a href="#" class="ml-1 tooltip" data-tooltip="Export" @click.prevent="onExport">
          <i class="icon icon-download"></i>
        </a>
      </div>
    </div>
    <div class="menu d-flex flex-column">
      <div class="form-group has-icon-right">
        <input class="form-input" v-model="search" />
        <i class="form-icon icon" :class="search ? 'icon-cross' : 'icon-search'" @click="onClear" />
      </div>
      <div class="flex-1 empty" v-if="!filtered.length"><div class="empty-title">None</div></div>
      <div class="flex-1" v-else>
        <div
          class="menu-item"
          v-for="(item, index) in filtered"
          :key="index">
          <button class="btn btn-clear float-right mt-2" @click="onRemove(index)"></button>
          <a href="#" :class="{active: activeIndex === index}" v-text="item.name" @click.prevent="onPick(item, index)"></a>
        </div>
      </div>
    </div>
    <data-modal
      v-if="modal"
      :title="modal.title"
      :content="modal.content"
      :readOnly="modal.readOnly"
      @change="onChange"
      @close="onClose">
      <span
        v-if="modal.message"
        class="mr-2"
        :class="modal.error ? 'text-error' : 'text-success'"
        v-text="modal.message"
      />
      <button v-if="!modal.readOnly" class="btn btn-primary" @click="importData">Import and merge</button>
      <button class="btn" @click="onClose">Close</button>
    </data-modal>
  </div>
</template>

<script>
import Vue from 'vue'; // eslint-disable-line
import VlModal from 'vueleton/lib/modal/bundle';
import { getStorage } from '~/components/utils';
import DataModal from '~/components/data-modal';

export default {
  components: {
    DataModal,
  },
  props: [
    'title',
    'storageKey',
    'activeIndex',
  ],
  data() {
    return {
      search: null,
      snapshots: [],
      modal: null,
    };
  },
  computed: {
    filtered() {
      const { search, snapshots } = this;
      if (!search) return snapshots;
      return snapshots.filter(item => item.name.includes(search));
    },
  },
  methods: {
    onRemove(index) {
      this.snapshots.splice(index, 1);
      this.dump();
    },
    onPick(item, index) {
      this.$emit('pick', index, item);
    },
    dump() {
      this.storage.dump(this.snapshots);
    },
    update({ name, data }, index) {
      const item = { name, data };
      const { snapshots } = this;
      // Remove current item
      if (index >= 0) snapshots.splice(index, 1);
      // Find proper place of the new item
      let activeIndex = 0;
      while (
        activeIndex < snapshots.length
        && this.compare(snapshots[activeIndex].name, name) < 0
      ) activeIndex += 1;
      // Insert new item into proper place
      snapshots.splice(activeIndex, 0, item);
      this.dump();
      return activeIndex;
    },
    get(index) {
      return this.snapshots[index];
    },
    onClear() {
      this.search = null;
    },
    compare(s1, s2) {
      s1 = `${s1 || ''}`;
      s2 = `${s2 || ''}`;
      return s1.localeCompare(s2, 'zh-CN');
    },
    onImport() {
      this.modal = {
        title: 'Import data',
        content: '',
        message: '',
        error: false,
      };
    },
    onExport() {
      const content = JSON.stringify(this.snapshots);
      this.modal = {
        title: 'Export data',
        content,
        readOnly: true,
      };
    },
    onChange(value) {
      this.modal.content = value;
    },
    onClose() {
      if (this.modal) {
        this.modal = null;
      }
    },
    importData() {
      try {
        const data = JSON.parse(this.modal.content);
        if (!Array.isArray(data)) throw new Error('Invalid data.');
        data.forEach((item) => {
          this.snapshots.push(item);
        });
        this.normalize();
        this.modal.message = 'Data imported successfully.';
        this.dump();
      } catch (err) {
        this.modal.error = true;
        this.modal.message = `${err}`;
        console.error(err);
        return;
      }
      this.modal.error = false;
    },
    normalize() {
      this.snapshots.sort((a, b) => this.compare(a.name, b.name));
    },
  },
  mounted() {
    this.storage = getStorage(this.storageKey);
    this.snapshots = this.storage.load([]);
    this.normalize();
  },
};
</script>

<style>
.snapshots {
  > .menu {
    height: 70vh;
  }
  .menu-item {
    &:not(:hover) > .btn-clear {
      display: none;
    }
    > a:not(.active):focus {
      background: none;
    }
  }
}

.snapshot {
  &-placeholder {
    opacity: 0.2;
  }
}
</style>
