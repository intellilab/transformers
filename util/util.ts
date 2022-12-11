function importStorage(input) {
  const store = JSON.parse(decodeURI(input));
  Object.entries(store)
    .forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
}

function exportStorage() {
  const { length } = localStorage;
  const store = {};
  for (let i = 0; i < length; i += 1) {
    const key = localStorage.key(i);
    store[key] = localStorage.getItem(key);
  }
  return encodeURI(JSON.stringify(store));
}

window.transformers = {
  import: importStorage,
  export: exportStorage,
};
