declare interface IPipe {
  meta: {
    name: string;
    options: Array<{
      type: 'input' | 'checkbox' | 'radio' | 'number';
      name: string;
      description: string;
      default?: unknown;
      choices?: Array<{ label: string; value: string }>;
      normalize?: (input: unknown) => unknown;
    }>;
  };
  handle(input: string, options?: Record<string, unknown>): string;
}

declare interface IPipeValue {
  name: string;
  /** Options from input which can be serialized and deserialized easily. */
  options: Record<string, unknown>;
  /** Normalized options which may contain complex objects. */
  normalizedOptions: Record<string, unknown>;
}

declare interface IColor {
  r: number;
  g: number;
  b: number;
  a: number;
}
