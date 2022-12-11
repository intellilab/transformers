<template>
  <div>
    <div class="flex h-screen">
      <aside class="flex flex-col p-3 bg-gray-100">
        <NuxtLink to="/"><h2>Transformers</h2></NuxtLink>
        <div class="flex-1 my-2">
          <NuxtLink class="menu-item" to="/string/">String pipes</NuxtLink>
          <NuxtLink class="menu-item" to="/url-builder/">URL Builder</NuxtLink>
          <NuxtLink class="menu-item" to="/color/">Color pipes</NuxtLink>
          <NuxtLink class="menu-item" to="/vmess/">VMess URL editor</NuxtLink>
        </div>
        <footer class="text-gray-600">
          <p>Designed with &hearts; by <a href="https://gera2ld.space" target="_blank" rel="noopener noreferrer">Gerald</a></p>
        </footer>
      </aside>
      <div class="flex-1 p-4 min-w-0 overflow-auto"><slot /></div>
      <TransitionGroup tag="ul" class="t-toast" name="anim-toast" appear>
        <li class="toast" v-for="toast in toasts" :key="toast.id" v-text="toast.text"></li>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toasts } from '../components/toast';
</script>
