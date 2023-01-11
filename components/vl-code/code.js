import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/selection/active-line';
import VlCode from 'vueleton/lib/code';

Object.assign(CodeMirror.keyMap.default, {
  Tab: 'indentMore',
  'Shift-Tab': 'indentLess',
});

export default VlCode;
