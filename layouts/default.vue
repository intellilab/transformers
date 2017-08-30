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
export default {
  mounted() {
    window.routes = this.$router.options.routes;
  },
};
</script>
