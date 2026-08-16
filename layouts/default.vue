<template>
  <UApp>
    <div class="flex h-dvh">
      <aside class="bg-muted flex flex-col p-3">
        <NuxtLink to="/"><h2 class="text-primary text-2xl">Transformers</h2></NuxtLink>
        <div class="my-2 flex-1">
          <NuxtLink
            class="text-dimmed hover:bg-muted [&.router-link-active]:bg-accented [&.router-link-active]:text-default flex cursor-pointer rounded px-2 py-1 transition-colors"
            to="/string/"
            >String pipes</NuxtLink
          >
          <NuxtLink
            class="text-dimmed hover:bg-muted [&.router-link-active]:bg-accented [&.router-link-active]:text-default flex cursor-pointer rounded px-2 py-1 transition-colors"
            to="/url-builder/"
            >URL Builder</NuxtLink
          >
        </div>
        <footer>
          <p>
            Designed with &hearts; by
            <a href="https://gera2ld.space" target="_blank" rel="noopener noreferrer">Gerald</a>
          </p>
        </footer>
      </aside>
      <slot />
    </div>
    <GithubCorners :size="40" href="https://github.com/intellilab/transformers" fixed />
  </UApp>
</template>

<script setup lang="ts">
import GithubCorners from '@uivjs/vue-github-corners';
</script>
