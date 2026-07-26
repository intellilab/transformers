<template>
  <main class="items-center justify-center">
    <h1 class="sr-only">Transformers</h1>
    <div class="text-default text-6xl font-black tracking-wider select-none" aria-hidden="true">
      <span
        v-for="(letter, i) in letters"
        :key="i"
        class="title-letter inline-block"
        :style="{ animationDelay: `${i * 0.1}s` }"
        >{{ letter }}</span
      >
    </div>
    <p class="text-dimmed mt-6 text-base select-none">A collection of handy tools</p>
    <p class="text-muted mt-8 text-base select-none">
      <span class="poke-left mr-1 inline-block">👈</span>
      Pick a tool from the sidebar
    </p>
  </main>
</template>

<script setup lang="ts">
const letters = 'TRANSFORMERS'.split('');
</script>

<style scoped>
@keyframes poke-left {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(0);
  }
}

@keyframes jump {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.35em);
  }
}

.title-letter {
  animation: jump 1.2s ease-in-out infinite;
}

.poke-left {
  animation: poke-left 0.8s ease-in-out infinite;
}
</style>
