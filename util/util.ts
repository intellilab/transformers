function importStorage(input: string) {
  const store: Record<string, string> = JSON.parse(decodeURI(input));
  Object.entries(store)
    .forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
}

function exportStorage() {
  const { length } = localStorage;
  const store: Record<string, string | null> = {};
  for (let i = 0; i < length; i += 1) {
    const key = localStorage.key(i);
    if (key) {
      store[key] = localStorage.getItem(key);
    }
  }
  return encodeURI(JSON.stringify(store));
}

(window as any).transformers = {
  import: importStorage,
  export: exportStorage,
};
