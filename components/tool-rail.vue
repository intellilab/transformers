<template>
  <div class="fixed right-0 top-0 h-full z-50 w-12">
    <div
      class="flex flex-col items-center gap-1 p-2 w-12 bg-muted border-l border-default h-full shrink-0"
    >
      <template v-for="item in items" :key="item.key">
        <UTooltip :text="item.label" :content="{ side: 'left' }">
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            :class="
              activeKey === item.key && isOpen
                ? 'bg-primary/10 text-primary'
                : 'text-dimmed hover:bg-elevated hover:text-default'
            "
            @click="togglePanel(item.key)"
          >
            <UIcon :name="item.icon" class="size-5" />
          </button>
        </UTooltip>
      </template>
    </div>
  </div>
  <Transition name="sidebar-panel">
    <div
      v-if="isOpen && activeItem"
      class="fixed right-12 top-0 h-full w-80 border-l border-default bg-default flex flex-col z-40"
    >
      <div
        class="flex items-center justify-between px-4 h-12 border-b border-default shrink-0"
      >
        <h3 class="font-semibold truncate">{{ activeItem.label }}</h3>
        <UButton
          icon="i-mdi-close"
          size="sm"
          variant="ghost"
          color="neutral"
          @click="isOpen = false"
        />
      </div>
      <div class="flex-1 min-h-0">
        <slot :name="`panel-${activeKey}`" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

export interface ToolRailItem {
  key: string;
  icon: string;
  label: string;
}

const props = defineProps<{
  items: ToolRailItem[];
}>();

const activeKey = ref<string | null>(null);
const isOpen = ref(false);

const activeItem = computed(() =>
  props.items.find((item) => item.key === activeKey.value),
);

function togglePanel(key: string) {
  if (activeKey.value === key && isOpen.value) {
    isOpen.value = false;
  } else {
    activeKey.value = key;
    isOpen.value = true;
  }
}
</script>

<style scoped>
.sidebar-panel-enter-active,
.sidebar-panel-leave-active {
  transition: transform 0.2s ease-out;
}
.sidebar-panel-enter-from,
.sidebar-panel-leave-to {
  transform: translateX(100%);
}
.sidebar-panel-enter-to,
.sidebar-panel-leave-from {
  transform: translateX(0);
}
</style>
