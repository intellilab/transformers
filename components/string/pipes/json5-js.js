import JSON5 from 'json5';

const MULTILINE = 'MULTILINE';
const SINGLELINE = 'SINGLELINE';
const KEY = 'KEY';
const COMMA = { type: 'comma', value: ',' };
const BR = { type: 'br', value: '\n' };

const charMapBase = {
  '\\': '\\\\',
  '\r': '\\r',
  '\t': '\\t',
};
const charMapQuote = {
  ...charMapBase,
  '\'': '\\\'',
  '\n': '\\n',
};
const charMapTemplate = {
  ...charMapBase,
  '`': '\\`',
};
function quoteString(str, { quote, template }) {
  if (template && /\n/.test(str)) {
    const quoted = str.replace(/[\\`\r\t]/g, m => charMapTemplate[m]);
    return `\`${quoted}\``;
  }
  if (quote || /\W/.test(str)) {
    const quoted = str.replace(/[\\'\r\n\t]/g, m => charMapQuote[m]);
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
      const rendered = data.map(item => render(item, options, level + 1));
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
    const rendered = Object.keys(data).flatMap(key => [
      {
        type: KEY,
        data: [{ value: quoteString(key, options), type: 'key' }],
        separator: [{ value: ':' }],
      },
      render(data[key], options, level + 1),
    ]);
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
    data: [{ value: typeof data === 'string' ? quoteString(data, { ...options, quote: 1 }) : data }],
  };
}

function join(rendered, options, level) {
  const arr = [];
  for (let i = 0; i < rendered.length; i += 1) {
    const item = rendered[i];
    const next = rendered[i + 1];
    if (item.data) arr.push(...item.data);
    // trailing separators
    if (item.separator && (next || options.trailing)) {
      arr.push(...item.separator);
    }
    if (next) {
      if (item.type === KEY) {
        arr.push({ value: ' ' });
      } else {
        arr.push(BR, getSpace(level, options.indent));
      }
    }
  }
  return arr;
}

export function handle(input, options) {
  const obj = JSON5.parse(input);
  const rendered = render(obj, options);
  return rendered.data.map(({ value }) => `${value}`).join('');
}

export const meta = {
  name: 'JSON5 to JavaScript',
  options: [
    {
      name: 'quote',
      description: 'Quote',
      type: 'radio',
      choices: [
        { value: 0, label: 'as needed' },
        { value: 1, label: 'always' },
      ],
      default: 0,
    },
    {
      name: 'indent',
      description: 'Indent',
      type: 'number',
      default: 2,
    },
    {
      name: 'trailing',
      description: 'Always add trailing commas',
      type: 'checkbox',
      default: true,
    },
    {
      name: 'template',
      description: 'Quote multiline strings as template literals',
      type: 'checkbox',
      default: true,
    },
  ],
};
