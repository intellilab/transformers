const watchers = new Set();

const query = window.matchMedia('(prefers-color-scheme: dark)');
query.addEventListener('change', (event) => {
  handleThemeChange(event);
});

function handleThemeChange({ matches }) {
  for (const watcher of watchers) {
    watcher(matches);
  }
}

export function onThemeChange(watcher) {
  watchers.add(watcher);
  watcher(query.matches);
  return () => {
    watchers.delete(watcher);
  };
}
