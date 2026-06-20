import { describe, it, expect } from 'vitest';
import { parsePipeline } from './parser';

describe('parsePipeline', () => {
  it('returns empty result for empty text', () => {
    const result = parsePipeline('');
    expect(result.pipes).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it('ignores whitespace-only lines', () => {
    const result = parsePipeline('   \n  \n');
    expect(result.pipes).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it('ignores comment lines', () => {
    const result = parsePipeline('# this is a comment\n# another one');
    expect(result.pipes).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it('parses a single pipe without options', () => {
    const result = parsePipeline('|> toJson');
    expect(result.pipes).toHaveLength(1);
    expect(result.pipes[0]).toEqual({ name: 'toJson', options: {}, line: 1 });
    expect(result.errors).toEqual([]);
  });

  it('parses a single pipe with options', () => {
    const result = parsePipeline('|> toJson({ indent: 2 })');
    expect(result.pipes).toHaveLength(1);
    expect(result.pipes[0]!.name).toBe('toJson');
    expect(result.pipes[0]!.options).toEqual({ indent: 2 });
    expect(result.errors).toEqual([]);
  });

  it('parses a pipe with empty parens', () => {
    const result = parsePipeline('|> output()');
    expect(result.pipes).toHaveLength(1);
    expect(result.pipes[0]!.options).toEqual({});
  });

  it('parses multiple pipes', () => {
    const result = parsePipeline('|> toJson\n|> output({ indent: 4 })');
    expect(result.pipes).toHaveLength(2);
    expect(result.pipes[0]!.name).toBe('toJson');
    expect(result.pipes[1]!.name).toBe('output');
    expect(result.pipes[1]!.options).toEqual({ indent: 4 });
  });

  it('strips trailing comments from pipe lines', () => {
    const result = parsePipeline('|> toJson  # convert to JSON');
    expect(result.pipes).toHaveLength(1);
    expect(result.pipes[0]!.name).toBe('toJson');
    expect(result.errors).toEqual([]);
  });

  it('preserves options when trailing comment present', () => {
    const result = parsePipeline('|> toJson({ indent: 2 })  # pretty print');
    expect(result.pipes[0]!.options).toEqual({ indent: 2 });
  });

  describe('errors', () => {
    it('reports unexpected statement', () => {
      const result = parsePipeline('hello world');
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.message).toContain('Unexpected statement');
      expect(result.errors[0]!.line).toBe(1);
    });

    it('continues parsing after an error', () => {
      const result = parsePipeline('garbage\n|> output');
      expect(result.errors).toHaveLength(1);
      expect(result.pipes).toHaveLength(1);
      expect(result.pipes[0]!.name).toBe('output');
    });
  });

  describe('pipe name validation', () => {
    const knownPipes = [
      { meta: { name: 'output' }, handle: () => '' },
    ] as any;

    it('passes validation for known pipe names', () => {
      const result = parsePipeline('|> output', knownPipes);
      expect(result.errors).toEqual([]);
      expect(result.pipes).toHaveLength(1);
    });

    it('reports error for unknown pipe names', () => {
      const result = parsePipeline('|> output\n|> nonexistent', knownPipes);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.message).toBe('Unknown pipe: nonexistent');
      expect(result.errors[0]!.line).toBe(2);
    });

    it('still includes unknown pipe in result despite validation error', () => {
      const result = parsePipeline('|> nonexistent', knownPipes);
      expect(result.errors).toHaveLength(1);
      expect(result.pipes).toHaveLength(1);
      expect(result.pipes[0]!.name).toBe('nonexistent');
    });

    it('skips validation when no pipeHandlers given', () => {
      const result = parsePipeline('|> nonexistent');
      expect(result.errors).toEqual([]);
      expect(result.pipes).toHaveLength(1);
    });
  });

  describe('full examples', () => {
    it('parses a pipeline with comments and pipes', () => {
      const text = [
        '# Convert to JSON',
        '|> yamlToJson({ indent: 2 })',
        '|> output',
      ].join('\n');
      const result = parsePipeline(text);
      expect(result.pipes).toHaveLength(2);
      expect(result.pipes[0]!.options).toEqual({ indent: 2 });
      expect(result.errors).toEqual([]);
    });
  });
});
