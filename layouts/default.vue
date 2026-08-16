<template>
  <UApp>
    <div class="flex h-dvh">
      <aside class="bg-muted flex flex-col p-3">
        <NuxtLink to="/"><h2 class="text-primary text-2xl">Transformers</h2></NuxtLink>
        <div class="my-2 flex-1">
          <NuxtLink
            class="text-dimmed hover:bg-muted [&.router-link-active]:bg-accented [&.router-link-active]:text-default flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors"
            to="/url-builder/"
            ><UIcon name="i-mdi-link-variant" class="size-4" />URL Builder</NuxtLink
          >
          <NuxtLink
            class="text-dimmed hover:bg-muted [&.router-link-active]:bg-accented [&.router-link-active]:text-default flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors"
            to="/string/"
            ><UIcon name="i-mdi-swap-horizontal" class="size-4" />String Pipes</NuxtLink
          >
          <NuxtLink
            class="text-dimmed hover:bg-muted [&.router-link-active]:bg-accented [&.router-link-active]:text-default flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors"
            to="/prettify/"
            ><UIcon name="i-mdi-wand" class="size-4" />Prettify</NuxtLink
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
