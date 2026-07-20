<template>
  <UApp>
    <div class="flex h-dvh">
      <aside class="flex flex-col p-3 bg-muted">
        <NuxtLink to="/"
          ><h2 class="text-2xl text-primary">Transformers</h2></NuxtLink
        >
        <div class="flex-1 my-2">
          <NuxtLink
            class="flex px-2 py-1 cursor-pointer text-dimmed hover:bg-muted rounded transition-colors [&.router-link-active]:bg-accented [&.router-link-active]:text-default"
            to="/curves/"
            >Curves</NuxtLink
          >
          <NuxtLink
            class="flex px-2 py-1 cursor-pointer text-dimmed hover:bg-muted rounded transition-colors [&.router-link-active]:bg-accented [&.router-link-active]:text-default"
            to="/string/"
            >String pipes</NuxtLink
          >
          <NuxtLink
            class="flex px-2 py-1 cursor-pointer text-dimmed hover:bg-muted rounded transition-colors [&.router-link-active]:bg-accented [&.router-link-active]:text-default"
            to="/url-builder/"
            >URL Builder</NuxtLink
          >
        </div>
        <footer>
          <p>
            Designed with &hearts; by
            <a
              href="https://gera2ld.space"
              target="_blank"
              rel="noopener noreferrer"
              >Gerald</a
            >
          </p>
        </footer>
      </aside>
      <slot />
    </div>
    <GithubCorners
      :size="40"
      href="https://github.com/intellilab/transformers"
      fixed
    />
  </UApp>
</template>

<script setup lang="ts">
import GithubCorners from '@uivjs/vue-github-corners';
</script>
