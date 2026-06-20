export {
  PipeHandler,
  PipeHandlerMeta,
  PipeHandlerInstance,
  PipeValue,
  IColor,
} from './components/pipes/types';

declare global {
  interface Window {
    transformers: {
      import: (input: string) => void;
      export: () => string;
    };
  }
}
