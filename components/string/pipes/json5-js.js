import { format } from '@gera2ld/format-json';

export function handle(input, options) {
  return format(input, {
    ...options,
    quoteAsNeeded: !!+options.quoteAsNeeded,
  });
}

export const meta = {
  name: 'JSON5 to JavaScript',
  options: [
    {
      name: 'quoteAsNeeded',
      description: 'Add quotes',
      type: 'radio',
      choices: [
        { value: 1, label: 'as needed' },
        { value: 0, label: 'always' },
      ],
      default: 1,
    },
    {
      name: 'quote',
      description: 'Preferred quote character',
      type: 'radio',
      choices: [
        { value: '\'', label: '\'' },
        { value: '"', label: '"' },
      ],
      default: '\'',
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
