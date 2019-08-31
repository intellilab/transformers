<template>
  <div class="menu snapshots d-flex flex-column">
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
</template>

<script>
import Vue from 'vue'; // eslint-disable-line
import { getStorage } from '~/components/utils';

export default {
  props: [
    'storageKey',
    'activeIndex',
  ],
  data() {
    return {
      search: null,
      snapshots: [],
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
  },
  mounted() {
    this.storage = getStorage(this.storageKey);
    this.snapshots = this.storage.load([]);
    this.snapshots.sort((a, b) => this.compare(a.name, b.name));
  },
};
</script>

<style>
.snapshots {
  height: 70vh;
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
