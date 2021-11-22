import { handle, meta } from '~/components/string/pipes/list-tree';

describe('list-tree', () => {
  test('markdown list to tree', () => {
    expect(handle(`\
- a
  - a1
  - a2
- b
  - b1
- c`)).toBe(`\
.
├── a
│   ├── a1
│   └── a2
├── b
│   └── b1
└── c`);
  });
});
