export function debounce(func, time) {
  let timer;
  return function debouncedFunc(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
}

export function getStorage(key) {
  return { load, dump };
  function load(def) {
    let data = def;
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) data = JSON.parse(raw);
    } catch (e) {
      // ignore error
    }
    return data;
  }
  function dump(data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

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
