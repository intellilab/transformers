<template>
  <div>
    <h3>My bookmarks</h3>
    <div class="empty" v-if="!bookmarks.length"><div class="empty-title">Nothing</div></div>
    <ul class="menu bookmarks" v-else>
      <li class="menu-item" v-for="(item, index) in bookmarks">
        <button class="btn btn-clear float-right mt-2" @click="onRemove(index)"></button>
        <a href="#" :class="{active: active === item}" v-text="item.name" @click.prevent="onPick(item, index)"></a>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'; // eslint-disable-line
import { getStorage } from '~/components/utils';

export default {
  props: [
    'storageKey',
    'active',
  ],
  data() {
    return {
      bookmarks: [],
    };
  },
  methods: {
    onRemove(index) {
      this.bookmarks.splice(index, 1);
      this.dump();
    },
    onPick(item, index) {
      this.$emit('pick', item, index);
    },
    dump() {
      this.storage.dump(this.bookmarks);
    },
    update({ name, data }, oldItem) {
      const item = { name, data };
      const index = this.bookmarks.findIndex(oldItem);
      if (index >= 0) {
        Vue.set(this.bookmarks, index, item);
      } else {
        this.bookmarks.push(item);
      }
      this.dump();
      return item;
    },
  },
  mounted() {
    this.storage = getStorage(this.storageKey);
    this.bookmarks = this.storage.load([]);
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
  .menu-item > a:not(.active):focus {
    background: none;
  }
}
</style>
