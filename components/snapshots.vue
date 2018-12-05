<template>
  <div class="empty" v-if="!snapshots.length"><div class="empty-title">None</div></div>
  <ul class="menu snapshots" v-else>
    <li
      class="menu-item"
      v-for="(item, index) in snapshots"
      :key="index"
      :class="{'snapshot-placeholder': dragging && dragging.index === index}"
      draggable="true"
      @dragstart="onDragStart($event, index)"
      @dragend="onDragEnd"
      @dragover="onDragOver($event, index)">
      <button class="btn btn-clear float-right mt-2" @click="onRemove(index)"></button>
      <a href="#" :class="{active: activeIndex === index}" v-text="item.name" @click.prevent="onPick(item, index)"></a>
    </li>
  </ul>
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
      snapshots: [],
    };
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
  },
  mounted() {
    this.storage = getStorage(this.storageKey);
    this.snapshots = this.storage.load([]);
  },
};
</script>

<style>
.snapshots {
  max-height: 70vh;
  overflow: auto;
  > :not(:hover) > .btn-clear {
    display: none;
  }
  .menu-item > a:not(.active):focus {
    background: none;
  }
}

.snapshot {
  &-placeholder {
    opacity: 0.2;
  }
}
</style>
