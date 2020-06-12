import test from 'tape';
import { handle, meta } from 'components/string/pipes/json5-js';

test('json5-js', t => {
  const options = meta.options.reduce((res, item) => {
    res[item.name] = item.default;
    return res;
  }, {});

  t.test('primary types', q => {
    q.equal(handle(`[1,2,3]`, options), `\
[
  1,
  2,
  3,
]`);
    q.equal(handle(`["a",1,true]`, options), `\
[
  'a',
  1,
  true,
]`);
    q.equal(handle(`{"a":1,"b":true,"c":"d"}`, options), `\
{
  a: 1,
  b: true,
  c: 'd',
}`);
    q.end();
  });

  t.test('object types', q => {
    q.equal(handle(`[{},{},{}]`, options), `\
[
  {},
  {},
  {},
]`);
    q.equal(handle(`[{},{"a":1},[]]`, options), `\
[
  {},
  {
    a: 1,
  },
  [],
]`);
    q.equal(handle(`[{"a":1},["s",[{"b":1}]]]`, options), `\
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
    q.end();
  });
});
