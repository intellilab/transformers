import Vue from 'vue';
import VueRouter from 'vue-router';
import 'spectre.css';
import Index from './pages';
import { routes } from './routes';

Vue.use(VueRouter);

const el = document.createElement('div');
document.body.appendChild(el);

const router = new VueRouter({
  routes,
});

new Vue({
  router,
  render: h => h(Index),
}).$mount(el);
