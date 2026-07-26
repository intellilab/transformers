<template>
  <main class="items-center justify-center">
    <h1 class="sr-only">Transformers</h1>
    <div class="text-6xl font-black text-default tracking-wider select-none" aria-hidden="true">
      <span
        v-for="(letter, i) in letters"
        :key="i"
        class="inline-block title-letter"
        :style="{ animationDelay: `${i * 0.1}s` }"
        >{{ letter }}</span
      >
    </div>
    <p class="mt-6 text-base text-dimmed select-none">A collection of handy tools</p>
    <p class="mt-8 text-base text-muted select-none">
      <span class="inline-block poke-left mr-1">👈</span>
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
