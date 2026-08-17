declare global {
  interface Window {
    transformers: {
      import: (input: string) => void;
      export: () => string;
    };
  }
}
