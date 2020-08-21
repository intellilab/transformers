import JSON5 from 'json5';
import _ from 'lodash';

export function handle(input, options) {
  let obj = JSON5.parse(input);
  if (options.path) obj = _.get(obj, options.path);
  return JSON.stringify(obj);
}

export const meta = {
  name: 'JSON get',
  options: [
    {
      name: 'path',
      description: 'Path',
      type: 'input',
      default: '',
    },
  ],
};
