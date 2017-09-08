<template>
  <div id="app" class="container">
    <div class="columns">
      <aside class="t-aside">
        <router-link to="/"><h2>Transformers</h2></router-link>
        <div class="t-aside-menu">
          <nuxt-link to="/string/">String pipes</nuxt-link>
        </div>
        <footer>
          <p>Designed with &hearts; by <a href="https://gerald.top">Gerald</a></p>
        </footer>
      </aside>
      <div class="t-content"><nuxt /></div>
      <a href="https://github.com/intellilab/transformers"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"></a>
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
