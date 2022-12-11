export class Storage<T> {
  constructor(private key: string) {}

  load(def: T) {
    let data = def;
    try {
      const raw = localStorage.getItem(this.key);
      if (raw != null) data = JSON.parse(raw);
    } catch (e) {
      // ignore error
    }
    return data;
  }

  dump(data: T) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}
