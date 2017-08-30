<template>
  <div id="app" class="container">
    <div class="columns">
      <aside class="t-aside">
        <router-link to="/"><h2>Tools</h2></router-link>
        <div class="t-aside-menu">
          <nuxt-link to="/string/">String pipes</nuxt-link>
        </div>
        <footer>
          <p>Designed with &hearts; by <a href="https://gerald.top">Gerald</a></p>
        </footer>
      </aside>
      <div class="t-content"><nuxt /></div>
    </div>
  </div>
</template>

<script>
import 'spectre.css';

export default {
  mounted() {
    window.routes = this.$router.options.routes;
  },
};
</script>

<style>
#app > .columns {
  height: 100vh;
}
.t-aside {
  display: flex;
  flex-direction: column;
  width: 12rem;
  flex: 0 0 auto;
  padding: 1rem;
  background: #f8f9fa;
  &-menu {
    flex: 1;
  }
}
.t-content {
  flex: 1;
  padding: 1rem;
  overflow: auto;
}
</style>
