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
