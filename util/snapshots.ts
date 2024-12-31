import { type Ref, ref } from 'vue';
import { Storage } from './storage';

export interface ISnapshot<T = unknown> {
  name: string;
  data: T;
}

export class Snapshots<T = unknown> {
  private storage: Storage<ISnapshot<T>[]>;
  private data: Ref<ISnapshot<T>[]>;

  constructor(key: string) {
    this.storage = new Storage(key);
    this.data = ref(this.storage.load([])) as Ref<ISnapshot<T>[]>;
    this.normalize();
  }

  get all() {
    return this.data.value;
  }

  normalize() {
    const value = [...this.data.value].sort((a, b) => this.compare(a, b));
    this.data.value = value;
  }

  compare(item1: ISnapshot, item2: ISnapshot) {
    const s1 = `${item1.name || ''}`;
    const s2 = `${item2.name || ''}`;
    return s1.localeCompare(s2, 'zh-CN');
  }

  dump() {
    this.storage.dump(this.data.value);
  }

  remove(index: number) {
    const value = [
      ...this.data.value.slice(0, index),
      ...this.data.value.slice(index + 1),
    ];
    this.data.value = value;
    this.dump();
  }

  updateItem(index: number, item: ISnapshot<T>) {
    const value = [...this.data.value];
    if (index >= 0) {
      value[index] = item;
    } else {
      index = value.length;
      value.push(item);
    }
    this.data.value = value;
    this.dump();
    return index;
  }

  update(callback: (data: ISnapshot<T>[]) => ISnapshot<T>[]) {
    this.data.value = callback(this.data.value);
    this.normalize();
    this.dump();
  }
}
