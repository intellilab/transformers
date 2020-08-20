<template>
  <div class="snapshots">
    <div class="flex mb-1">
      <slot name="title"><span v-text="title"></span></slot>
      <a href="#" class="ml-1 tooltip inline-block" data-tooltip="Import" @click.prevent="onImport">
        <svg viewBox="0 0 20 20" fill="currentColor" class="upload w-6 h-6"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
      </a>
      <a href="#" class="ml-1 tooltip inline-block" data-tooltip="Export" @click.prevent="onExport">
        <svg viewBox="0 0 20 20" fill="currentColor" class="download w-6 h-6"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </a>
    </div>
    <div class="flex flex-col shadow p-2 rounded" style="height:70vh">
      <div class="form-group has-icon-right mb-2">
        <input class="form-input" v-model="search" />
        <i class="form-icon icon" :class="search ? 'icon-cross' : 'icon-search'" @click="onClear" />
      </div>
      <div class="flex-1 empty" v-if="!filtered.length"><div class="empty-title">None</div></div>
      <div class="flex-1 overflow-y-auto" v-else>
        <div
          class="menu-item"
          :class="{active: activeIndex === item.index}"
          v-for="item in filtered"
          :key="item.index">
          <div class="flex-1" v-text="item.data.name" @click.prevent="onPick(item)"></div>
          <a href="#" @click.prevent="onRemove(item)">
            <svg viewBox="0 0 20 20" fill="currentColor" class="x w-6 h-6"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </a>
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
      let items = snapshots.map((data, index) => ({ data, index }));
      if (search) {
        items = items.filter(({ data }) => data.name.includes(search));
      }
      return items;
    },
  },
  methods: {
    onRemove({ index }) {
      this.snapshots.splice(index, 1);
      this.dump();
    },
    onPick({ index, data }) {
      this.$emit('pick', index, data);
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
