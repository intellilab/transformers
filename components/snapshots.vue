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
        :key="index"
        :class="{'snapshot-placeholder': dragging && dragging.currentIndex === index}"
        :draggable="search ? 'false' : 'true'"
        @dragstart="onDragStart($event, index)"
        @dragend="onDragEnd"
        @dragover="onDragOver($event, index)">
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
      dragging: null,
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
      if (index < 0) {
        this.snapshots.push(item);
      } else {
        Vue.set(this.snapshots, index, item);
      }
      this.dump();
      return index < 0 ? this.snapshots.length - 1 : index;
    },
    get(index) {
      return this.snapshots[index];
    },
    onDragStart(e, index) {
      if (this.search) {
        e.preventDefault();
        return;
      }
      const {
        clientX,
        clientY,
        offsetX,
        offsetY,
        target: { offsetWidth, offsetHeight },
      } = e;
      const style = {
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
        top: `${clientY - offsetY}px`,
        left: `${clientX - offsetX}px`,
      };
      this.dragging = {
        currentIndex: index,
        style,
        offsetX,
        offsetY,
        currentItem: this.snapshots[index],
      };
    },
    onDragOver(e, index) {
      const {
        snapshots,
        dragging,
        activeIndex,
      } = this;
      const {
        currentIndex,
        currentItem,
      } = dragging;
      if (currentIndex === index) return;
      const item = snapshots[index];
      Vue.set(snapshots, currentIndex, item);
      let newIndex = -1;
      if (activeIndex === currentIndex) {
        newIndex = index;
      } else if (activeIndex > currentIndex && activeIndex <= index) {
        newIndex = activeIndex - 1;
      } else if (activeIndex < currentIndex && activeIndex >= index) {
        newIndex = activeIndex + 1;
      }
      Vue.set(snapshots, dragging.currentIndex = index, currentItem);
      if (newIndex >= 0) this.$emit('update', newIndex);
      this.storage.dump(this.snapshots);
    },
    onDragEnd() {
      this.dragging = null;
    },
    onClear() {
      this.search = null;
    },
  },
  mounted() {
    this.storage = getStorage(this.storageKey);
    this.snapshots = this.storage.load([]);
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
