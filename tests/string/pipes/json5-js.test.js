import { handle, meta } from '~/components/string/pipes/json5-js';

describe('json5-js', () => {
  const options = meta.options.reduce((res, item) => {
    res[item.name] = item.default;
    return res;
  }, {});

  test('primary types', () => {
    expect(handle(`[1,2,3]`, options)).toBe(`\
[
  1,
  2,
  3,
]`);
    expect(handle(`["a",1,true]`, options)).toBe(`\
[
  'a',
  1,
  true,
]`);
    expect(handle(`{"a":1,"b":true,"c":"d"}`, options)).toBe(`\
{
  a: 1,
  b: true,
  c: 'd',
}`);
  });

  test('object types', () => {
    expect(handle(`[{},{},{}]`, options)).toBe(`\
[
  {},
  {},
  {},
]`);
    expect(handle(`[{},{"a":1},[]]`, options)).toBe(`\
[
  {},
  {
    a: 1,
  },
  [],
]`);
    expect(handle(`[{"a":1},["s",[{"b":1}]]]`, options)).toBe(`\
[
  {
    a: 1,
  },
  [
    's',
    [
      {
        b: 1,
      },
    ],
  ],
]`);
  });
});
