<template>
  <div class="z-10 flex h-full">
    <Transition name="sidebar-panel">
      <div
        v-if="isOpen && activeItem"
        class="border-default bg-muted fixed top-0 right-12 bottom-0 left-0 flex flex-col border-l md:static md:left-auto md:w-80"
      >
        <div class="border-default flex h-12 shrink-0 items-center justify-between border-b px-4">
          <h3 class="truncate font-semibold">{{ activeItem.label }}</h3>
          <UButton
            icon="i-mdi-close"
            size="sm"
            variant="ghost"
            color="neutral"
            @click="isOpen = false"
          />
        </div>
        <div class="min-h-0 flex-1">
          <slot :name="`panel-${activeKey}`" />
        </div>
      </div>
    </Transition>
    <div
      class="bg-muted border-muted z-10 flex h-full w-12 shrink-0 flex-col items-center gap-1 border-l p-2 pt-8"
    >
      <template v-for="item in items" :key="item.key">
        <UTooltip :text="item.label" :content="{ side: 'left' }">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
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

const activeItem = computed(() => props.items.find((item) => item.key === activeKey.value));

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
