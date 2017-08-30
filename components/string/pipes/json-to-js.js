const MULTILINE = 'MULTILINE';
const SINGLELINE = 'SINGLELINE';
const KEY = 'KEY';
const COMMA = { type: 'comma', value: ',' };
const BR = { type: 'br', value: '\n' };

function quoteString(str, shouldQuote = 1) {
  if (shouldQuote || /\W/.test(str)) {
    const quoted = str.replace(/([\\'])/g, '\\$1');
    return `'${quoted}'`;
  }
  return str;
}

function getSpace(level, indent) {
  return { type: 'space', value: ' '.repeat(indent * level) };
}

function render(data, options, level = 0) {
  if (Array.isArray(data)) {
    const arr = [];
    const ret = {
      type: MULTILINE,
      separator: [COMMA],
      data: arr,
    };
    arr.push({ value: '[' });
    if (data.length) {
      const rendered = data.reduce((res, item) => [
        ...res,
        render(item, options, level + 1),
      ], []);
      arr.push(
        BR,
        getSpace(level + 1, options.indent),
        ...join(rendered, options, level + 1),
        BR,
        getSpace(level, options.indent),
      );
    } else {
      ret.type = SINGLELINE;
    }
    arr.push({ value: ']' });
    return ret;
  }
  if (data === null) {
    return {
      type: SINGLELINE,
      separator: [COMMA],
      data: [{ value: data, type: 'null' }],
    };
  }
  if (typeof data === 'object') {
    const arr = [];
    const ret = {
      type: MULTILINE,
      separator: [COMMA],
      data: arr,
    };
    arr.push({ value: '{' });
    const rendered = Object.keys(data).reduce((res, key) => [
      ...res,
      {
        type: KEY,
        data: [{ value: quoteString(key, options.quote), type: 'key' }],
        separator: [{ value: ':' }],
      },
      render(data[key], options, level + 1),
    ], []);
    if (rendered.length) {
      arr.push(
        BR,
        getSpace(level + 1, options.indent),
        ...join(rendered, options, level + 1),
        BR,
        getSpace(level, options.indent),
      );
    } else {
      ret.type = SINGLELINE;
    }
    arr.push({ value: '}' });
    return ret;
  }
  return {
    type: SINGLELINE,
    separator: [COMMA],
    data: [{ value: typeof data === 'string' ? quoteString(data) : data }],
  };
}

function join(rendered, options, level) {
  const arr = [];
  for (let i = 0; i < rendered.length; i += 1) {
    const item = rendered[i];
    const next = rendered[i + 1];
    if (item.data) arr.push(...item.data);
    // trailing separators
    if (item.separator) arr.push(...item.separator);
    if (next) {
      if (
        next.type === KEY ||
        (item.type !== KEY && (
          item.type === SINGLELINE || next.type === SINGLELINE
        ))
      ) {
        arr.push(BR, getSpace(level, options.indent));
      } else {
        arr.push({ value: ' ' });
      }
    }
  }
  return arr;
}

export function handle(input, options) {
  const obj = JSON.parse(input);
  const rendered = render(obj, options);
  return rendered.data.map(({ value }) => `${value}`).join('');
}

export const meta = {
  name: 'JSON to JavaScript',
  options: [
    {
      name: 'quote',
      description: 'Quote (0 for as needed, 1 for always, default as 0)',
      default: 0,
    },
    {
      name: 'indent',
      description: 'Indent (default as 2)',
      default: 2,
    },
  ],
};
