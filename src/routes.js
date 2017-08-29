import Home from './pages/home';

const requireTool = require.context('./pages/tools', true, /\/\w+\/index.vue$/);
export const tools = requireTool.keys()
.map(key => requireTool(key).default);

export const toolRoutes = tools.map(component => ({
  path: `/${component.meta.name}`,
  component,
}));

export const routes = [
  { path: '/', component: Home },
  ...toolRoutes,
  { path: '*', redirect: '/' },
];
