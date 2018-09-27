<template>
  <div>
    <h3>My Snapshots</h3>
    <div class="empty" v-if="!snapshots.length"><div class="empty-title">None</div></div>
    <ul class="menu snapshots" v-else>
      <li
        class="menu-item"
        v-for="(item, index) in snapshots"
        :class="{'snapshot-placeholder': dragging && dragging.index === index}"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragend="onDragEnd"
        @dragover="onDragOver($event, index)">
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
      this.$emit('pick', item, index);
    },
    dump() {
      this.storage.dump(this.snapshots);
    },
    update({ name, data }, oldItem) {
      const item = { name, data };
      const index = this.snapshots.indexOf(oldItem);
      if (index >= 0) {
        Vue.set(this.snapshots, index, item);
      } else {
        this.snapshots.push(item);
      }
      this.dump();
      return item;
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
        index,
        style,
        offsetX,
        offsetY,
        item: this.snapshots[index],
      };
    },
    onDragOver(e, index) {
      const { dragging } = this;
      if (dragging.index === index) return;
      const item = this.snapshots[index];
      Vue.set(this.snapshots, dragging.index, item);
      Vue.set(this.snapshots, dragging.index = index, dragging.item);
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
  max-height: 400px;
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
